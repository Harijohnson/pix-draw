import './App.css'
import { PixelArtEditor } from "@/_components/pixel-art-editor"
import Header from "@/_components/header"
function App() {
  return (
   <div>
    <Header />
    <main className="flex min-h-[90vh] flex-col items-center   bg-gray-400 relative">
      <PixelArtEditor />
    </main>
    <div className=' bottom-10 right-10 z-50 float-right sticky'>
      <a href="https://github.com/Harijohnson/pix-draw" target="_blank">
        <img src="/svg/pix.svg" alt="pix-art" width={40}  height={40}/>
      </a>
    </div>
   </div>
  )
}

export default App
