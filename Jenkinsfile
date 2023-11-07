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
                branch "main"
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
            }
            steps {
                sh 'echo "Deploy!"'
                script {
                    sshagent(credentials: ['ubuntu-key']) {
                        // // SSH into the remote server and run docker-compose down
                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@18.142.253.53 "docker-compose -f /home/ec2-user/app/docker-compose.yml down"'

                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@18.142.253.53 "mkdir -p /home/ec2-user/app"'

                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@18.142.253.53 "docker pull phatnguyen1812/qldapm:latest"'

                        // Copy docker-compose
                        sh 'scp -o StrictHostKeyChecking=no docker-compose.yml ec2-user@18.142.253.53:/home/ec2-user/app'

                        // Copy nginx.conf file
                        sh 'scp -o StrictHostKeyChecking=no nginx.conf ec2-user@18.142.253.53:/home/ec2-user/app'

                        // Start container
                        sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@18.142.253.53 "docker-compose -f /home/ec2-user/app/docker-compose.yml up -d"
                        '''
                    }
                }
            }
        }
    }
}