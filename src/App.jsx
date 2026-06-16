import { useState } from 'react'
import { NotebookPen,Pencil, Trash2, ArrowDownToLine, CirclePlus } from 'lucide-react';

const COLORS = [
  { bg: 'bg-green-200', text: 'text-green-900' },
  { bg: 'bg-yellow-200', text: 'text-yellow-900' },
  { bg: 'bg-blue-200', text: 'text-blue-900' },
  { bg: 'bg-pink-200', text: 'text-pink-900' },
  { bg: 'bg-orange-200', text: 'text-orange-900' },
  { bg: 'bg-cyan-200', text: 'text-cyan-900' },
  { bg: 'bg-purple-200', text: 'text-purple-900' },
]
// functional component - Pure app ka UI isi component ke andar hai.
const App = () => {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [tasks, setTasks] = useState([]) // Saare notes(title, details) array me store honge.
  const [editingIdx, setEditingIdx] = useState(null)// Kaunsa note edit ho raha hai uska index store hota hai.
  const [editTitle, setEditTitle] = useState('')
  const [editDetails, setEditDetails] = useState('')

  const addNote = () => {
    if (!title.trim()) return // trim() -remove space, Agar title empty hai to function stop ho jayega.
    setTasks([...tasks, { title, details, time: new Date() }])
    setTitle('')
    setDetails('')
  }

  const deleteNote = (idx) => { //jis note ko delete karna hai uska index.
    if (editingIdx === idx) setEditingIdx(null) //Jo note edit ho raha tha wahi delete ho raha hai, toh editing mode m null value set krdo kyuki vo note delete ho raha hai.
    setTasks(tasks.filter((_, i) => i !== idx))// (_, i) element ignore, only index use
  }

  const startEdit = (idx) => {
    setEditingIdx(idx)
    setEditTitle(tasks[idx].title)// eg -Agar note ka title "Daily Work" hai, to edit input me wahi aa jayega.
   //User ko purana data dikhega, taaki wo usme changes kar sake.
    setEditDetails(tasks[idx].details)
  }

  const saveEdit = () => {

    const updated = [...tasks]
    updated[editingIdx] = {
      ...updated[editingIdx],
      title: editTitle || updated[editingIdx].title, //    //Agar user title khali chhod de, to purana title rakho
      details: editDetails,
      time: new Date()
    }
    setTasks(updated) //Ab new array React state me chali jayegi.
    setEditingIdx(null) //aab koi note edit mode me nahi rahega.
  }

  return (
    <div className='min-h-screen flex bg-gray-950 text-white'>
      {/* Sidebar */}
      <div className='w-80 min-w-80 bg-gray-900 border-r border-gray-700 p-8 flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold text-white flex items-center gap-2'>
          <NotebookPen size={20} /> Add note
        </h1>

        <input
          type='text'
          placeholder='Note heading...'
          className='px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-gray-400 text-sm'
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && document.getElementById('details-input').focus()} // “Agar user Enter press kare, toh cursor textarea pe shift kar do.”
          // e - konsa key press hua kis element pe hua,aur bahut info
   // e.key - Kya user ne Enter key press ki?
    // document.getElementById('details-input') - details textarea element ko select karna.
    //cursor() - Cursor us element pe le jata hai.

        />

        <textarea
          id='details-input'
          placeholder='Write details here...'
          className='px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-gray-400 text-sm h-28 resize-none'
          value={details}
          onChange={e => setDetails(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && addNote()} // call addnote Agar user Ctrl + Enter press kare toh note save kar do.
        />

        <button
          onClick={addNote}
          className='w-full py-2.5 rounded-lg bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2'
        >
          <CirclePlus size={16} /> Add note
        </button>

        <p className='text-gray-500 text-xs mt-auto'>
          {tasks.length} note{tasks.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Notes Grid */}
      <div className='flex-1 bg-gray-950 p-8 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-6'>Recent notes</h2>

        {tasks.length === 0 ? (
          <p className='text-gray-500 text-sm mt-16 text-center'>No notes yet. Add your first one!</p> // it shows No notes yet. Add your first one! if false-> //To message disappear ho jayega aur notes grid show ho jayegi.
        ) : (
          <div className='grid grid-cols-2 xl:grid-cols-3 gap-4'> 
            {tasks.map((note, idx) => {
              const color = COLORS[idx % COLORS.length]//Agar notes zyada ho gaye to colors repeat honge.
              const isEditing = editingIdx === idx
              const timeStr = note.time.toLocaleString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              }) //Ye note ka saved time readable format me convert karta hai.

              return (
                <div key={idx} className={`${color.bg} ${color.text} rounded-2xl p-5 flex flex-col gap-2 min-h-40 relative`}>
                  <span className='text-xs font-semibold uppercase tracking-wide opacity-60'>Day {idx + 1}</span>

                  {isEditing ? (
                    <> 
                      <span className='absolute top-3 right-3 text-xs bg-black/10 px-2 py-0.5 rounded-full font-medium'>editing</span>
                      <input
                        autoFocus
                        className='w-full bg-white/40 border border-black/20 rounded px-2 py-1 text-sm font-semibold outline-none'
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveEdit()}
                      /> 
                      <textarea
                        className='w-full bg-white/40 border border-black/20 rounded px-2 py-1 text-xs outline-none resize-none h-14'
                        value={editDetails}
                        onChange={e => setEditDetails(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && e.ctrlKey && saveEdit()}
                      />
                    </>
                  ) : (
                    <>
                      <p className='font-semibold text-base leading-tight'>{note.title}</p>
                      <p className='text-xs leading-relaxed opacity-75 flex-1'>{note.details}</p>
                    </>
                  )}

                  <p className='text-xs opacity-50'>
                    {isEditing ? 'Enter to save · Ctrl+Enter for textarea' : timeStr}
                  </p>

                  <div className='flex gap-2 mt-1'>
                    {isEditing ? (
                      <button
                        onClick={saveEdit}
                        className='flex-1 py-1.5 rounded-md bg-green-600 text-white text-xs font-semibold active:scale-95 hover:bg-green-700 transition-all flex items-center justify-center gap-1.5'
                      >
                        <ArrowDownToLine size={13} /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(idx)}
                        className='flex-1 py-1.5 rounded-md bg-blue-500 text-white text-xs font-semibold active:scale-95 hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5'
                      >
                        <Pencil size={13} /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteNote(idx)}
                      className='flex-1 py-1.5 rounded-md bg-red-500 text-white text-xs font-semibold active:scale-95 hover:bg-red-600 transition-all flex items-center justify-center gap-1.5'
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default App