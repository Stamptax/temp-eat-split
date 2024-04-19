import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function Friend({ friend, handleSelection, selected }) {
  const isSelected = selected?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance < 0 ?
          <p className="red">You owe{friend.name} {Math.abs(friend.balance)}$</p> :
          friend.balance > 0 ?
            <p className="green">{friend.name} owes you {friend.balance}</p> :
            <p>{friend.name} and you are even</p>
      }
      <Button onClick={() => handleSelection(friend)} >{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

function FriendsList({ data, handleSelection, selected }) {
  return (
    <ul>
      {
        data.map(i => <Friend friend={i} key={i.id} handleSelection={handleSelection} selected={selected} />)
      }
    </ul>
  )
}



function FormAddFriend({ isOpen, onAdd }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id
    }
    onAdd(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    isOpen && (<form className="form-add-friend" onSubmit={handleSubmit}>
      <label label >🌸Friend Name</label >
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <label>🔗Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />
      <Button>Add</Button>
    </form >)
  )
}

function FormSplitBill({ selected, handleSplit }) {
  const [bill, setBill] = useState('');
  const [userExpense, setUserExpense] = useState('')
  const [payer, setPayer] = useState('user');
  const byFriend = Number(Number(bill) - Number(userExpense));

  function updates(e) {
    e.preventDefault();
    if (!bill || !byFriend) return;
    handleSplit(payer === 'user' ? byFriend : -userExpense);
  }


  return (
    <form className="form-split-bill" onSubmit={updates}>
      <h2>Split a bill with {selected.name}</h2>
      <label>💰Total Cost </label>
      <input type="text" value={bill} onChange={e => setBill(e.target.value)} />
      <label>💰Your expense</label>
      <input type="text" v alue={userExpense} onChange={e => setUserExpense(Number(e.target.value) > bill ? userExpense : Number(e.target.value))} />
      <label>💰 {selected.name}'s expense</label>
      <input type="text" value={byFriend} disabled />
      <label>💰  Who's paying the bill</label>
      <select value={payer} onChange={e => setPayer(e.target.value)} >
        <option value="user" key="">You</option>
        <option value="friend" key="">{selected.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [mateList, setMateList] = useState(initialFriends);
  const [selected, setSelected] = useState(null);

  function handlleToggle() {
    setIsOpen(!isOpen);
  }

  function addMate(newMate) {
    setMateList(mateList => [...mateList, newMate]);
    setIsOpen(false);
  }

  function handleSelection(friend) {
    setSelected(cur => (cur?.id === friend.id ? null : friend))
    setIsOpen(false);
  }

  function handleSplit(value) {
    setMateList((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelected(null);
  }

  return (
    <div className="app">
      <div className="sidebar" >
        <FriendsList data={mateList} handleSelection={handleSelection} selected={selected} />
        <FormAddFriend isOpen={isOpen} onAdd={addMate} />
        {
          isOpen ? <Button onClick={handlleToggle}>Close</Button> : <Button onClick={handlleToggle}>Add Friend</Button>
        }
      </div>

      {
        selected && <FormSplitBill selected={selected} handleSplit={handleSplit} key={selected.id} />
      }

    </div>
  )
}