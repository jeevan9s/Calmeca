import { easeInOut, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronRight } from 'react-feather'
import '@/renderer/styles/alerts.css'

type alertProps = {
  isAlertsOpen: boolean
  setIsAlertsOpen: (open: boolean) => void
  isLocked: boolean
}

export default function Alerts({ isAlertsOpen, setIsAlertsOpen, isLocked }: alertProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    function onResize() {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  
  let width = '16rem'
  let height = '4rem'

if (windowWidth >= 1400) {
  width = '26rem'
  height = '6.55rem'
} else if (windowWidth >= 1200) {
  width = '24rem'
  height = '6.5rem'
} else if (windowWidth >= 1024) {
  width = '22.5rem'
  height = '6rem'
} else if (windowWidth >= 900) {
  width = '19rem'
  height = '5.25rem'
} else if (windowWidth >= 768) {
  width = '15rem'
  height = '4.5rem'
} else if (windowWidth >= 600) {
  width = '12rem'
  height = '4rem'
} else if (windowWidth >= 400) {
  width = '10rem'
  height = '3.5rem'
} else if (windowWidth >= 320) {
  width = '8rem'
  height = '3rem'
} else {
  width = '6rem'
  height = '2.5rem'
}

if (windowHeight <= 600) {
  height = '3rem'
}

let leftPos = 'left-[15rem]'
if (isLocked) {
  leftPos = 'left-[25rem]'
}



  return (
    <motion.div
      id="alerts-panel"
      initial={{ opacity: 0, scale: 0.95, y: -12, x: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        width,
        height
      }}
      exit={{ opacity: 0, scale: 0.95, y: -12, x: 0 }}
      transition={{ duration: 0.3, ease: easeInOut }}
      className={`fixed top-12 z-50 rounded-xl bg-zinc-900/95] ${leftPos}`}
    >
      <div className="flex justify-end w-full">
        <button   className="
    text-white text-sm 
    w-[23px] h-[23px] 
    rounded-[6px] 
    flex items-center justify-center 
    mr-5 mt-3 
    transition-colors duration-200 ease-in-out 
    hover:bg-white/10 
    cursor-pointer
  " onClick={() => setIsAlertsOpen(false)}>
          <ChevronRight size={18}/>
        </button>
      </div>
    </motion.div>
  )
}
