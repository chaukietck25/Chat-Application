pipeline {
    agent any

    tools{
        nodejs 'node-20'
    }

    stages {
        stage('Checkout'){
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run unit test') {
            steps {
                sh 'npm run test -- --passWithNoTests'
            }
        }

        stage('Build and deploy Docker image') {
            when {
                branch 'main'
                branch "jenkins"
            }
            steps {
                script{
                    try {
                        withDockerRegistry(credentialsId: 'dockerid', url: 'https://index.docker.io/v1/'){
                            sh 'echo "Build"'
                            sh 'docker build -t phatnguyen1812/qldapm:latest --progress=plain .'
                            sh 'docker push phatnguyen1812/qldapm:latest'
                            sh 'echo "Push"'
                        }
                        bitbucketStatusNotify(buildState: 'SUCCESSFUL')
                    } catch (Exception e) {
                        
                    }
                }
            }
        }

        stage('Deploy into EC2') {
            when {
                branch "main"
                branch "jenkins"
            }
            steps {
                sh 'echo "Deploy!"'
                script {
                    sshagent(credentials: ['ubuntu-key']) {
                        // // SSH into the remote server and run docker-compose down
                        // sh '''
                        //     ssh ec2-user@54.179.96.14 << EOF
                        //     if [ "$(docker-compose -f /home/ec2-user/app/docker-compose.yml ps -q)" ]; then
                        //         docker-compose -f /home/ec2-user/app/docker-compose.yml down
                        //     fi
                        // '''
                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@54.169.206.88 "mkdir /home/ec2-user/app"'

                        // Copy docker-compose
                        sh 'scp -o StrictHostKeyChecking=no docker-compose.yml ec2-user@54.169.206.88:/home/ec2-user/app'

                        // Copy nginx.conf file
                        sh 'scp -o StrictHostKeyChecking=no nginx.conf ec2-user@54.169.206.88:/home/ec2-user/app'

                        // Start container
                        sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@54.169.206.88 "docker-compose -f /home/ec2-user/app/docker-compose.yml up -d"
                        '''
                    }
                }
            }
        }
    }
}