import React, { useEffect, useState, useContext } from 'react'
import Friend from './Friend'
import Search from '../Search/Search'
import styles from './styles.module.css'
import RequestList from './RequestList'

const testData = [
  {
    id: 1,
    username: 'Nguyen Van A',
    lastestMessage: 'noi gi do that daaaaaiiiiii',
    img: '...',
    timestamp: '2 phút trước',
    status: true, /* true: đã đọc, false: chưa đọc*/
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: true
  },
  {
    id: 2,
    username: 'Nguyen Van B',
    lastestMessage: 'noi gi do di',
    img: '...',
    timestamp: '2 giờ trước',
    status: false, /* true: đã đọc, false: chưa đọc*/
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: true
  },
  {
    id: 1,
    username: 'Nguyen Van C',
    lastestMessage: 'noi gi do that daaaaaiiiiii',
    img: '...',
    timestamp: '2 phút trước',
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: true
  },{
    id: 1,
    username: 'Nguyen Van D',
    lastestMessage: 'noi gi do that daaaaaiiiiii',
    img: '...',
    timestamp: '2 phút trước',
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: false
  },
  {
    id: 2,
    username: 'Nguyen Van A',
    lastestMessage: 'noi gi do di',
    img: '...',
    timestamp: '2 giờ trước',
    status: false, /* true: đã đọc, false: chưa đọc*/
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: false
  },
  {
    id: 1,
    username: 'Nguyen Van A',
    lastestMessage: 'noi gi do that daaaaaiiiiii',
    img: '...',
    timestamp: '2 phút trước',
    status: true, /* true: đã đọc, false: chưa đọc*/
    user: false, /*true: người gửi là user, false: người gửi là bạn */
    active: false
  },
]

const AllFriends = (props) => {
  const [friends, setFriends] = useState(testData)
  const [showAll, setShowAll] = useState(false)
    const handleShowAll = () => {
        setShowAll(!showAll)
    }
  const customOverflow = {
    overflow: "auto",
    backgroundColor:" red",
    width: "300px"
  }
  return (
    <div className={styles.container}>
      <Search/>
      {showAll?        
        <>
        
            <h1>Active Friends</h1>
            <div className={styles.list_container}>

                {friends.map((item, index)=>{
                    if(item.active)
                return ( 
                    <Friend friend = {item}/>)
                })}
            </div>
            <button onClick={handleShowAll} >See all Friends</button>
            <RequestList/>
        </>:
      
        <>
            <h1>All Friends</h1>
            <div className={styles.list_container}>

                {friends.map((item, index)=>{
                    return ( 
                    <Friend friend = {item}/>)
                })}
            </div>
            <button onClick={handleShowAll}>Hide All Friends</button>
        </>
        }
    </div>
  )
}


export default AllFriends