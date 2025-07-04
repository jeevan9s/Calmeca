import { PiCopy } from 'react-icons/pi'
import {
  ChevronsRight,
  ChevronsDown,
  Minus,
  X,
  Square,
  Menu,
  Calendar,
  Bell,
  Hexagon
} from 'react-feather'
import '@/renderer/styles/tb.css'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getLastEditedTime, getRelativeTimeStamp } from '@/services/utils & integrations/utilityServicies'

type TitleBarProps = {
  solidBackground?: boolean
  outline?: boolean
  isHovered: boolean
  isLocked: boolean
  isCalendarHovered: boolean
  isCalendarLocked: boolean
  ontoggleQuickNav?: () => void
  ontoggleAlerts?: () => void
  setIsLocked: (locked: boolean) => void
  setIsHovered: (hovering: boolean) => void
  setIsCalendarLocked: (calendarLocked: boolean) => void
  setIsCalendarHovered: (calendarHovered: boolean) => void
  isAlertsOpen: boolean
  isQuickNavOpen: boolean
  disableButton: boolean
}


export default function TitleBar({
  isLocked,
  isHovered,
  isCalendarHovered,
  isCalendarLocked,
  isAlertsOpen,
  isQuickNavOpen,
  setIsCalendarHovered,
  setIsCalendarLocked,
  setIsHovered,
  setIsLocked,
  ontoggleQuickNav,
  ontoggleAlerts,
  disableButton,
  solidBackground = false,
  outline = false
}: TitleBarProps) {
  const [isMaximized, setisMaximized] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  
const [lastEdited, setLastEdited] = useState<Date | null>(null)
const [relativeTime, setRelativeTime] = useState('')

useEffect(() => {
  const fetchAndUpdate = async () => {
    const timestamp = await getLastEditedTime()
    setLastEdited(timestamp)
    setRelativeTime(getRelativeTimeStamp(timestamp))
  }

  fetchAndUpdate()

  const interval = setInterval(fetchAndUpdate, 60000) // every 60 seconds

  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    const onMax = () => setisMaximized(true)
    const onUnmax = () => setisMaximized(false)
    window.ipcRenderer.on('maximized', onMax)
    window.ipcRenderer.on('not-maximized', onUnmax)

    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.ipcRenderer.off('maximized', onMax)
      window.ipcRenderer.off('not-maximized', onUnmax)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const shouldShowHoverZone =
    windowWidth >= 640 && !isCalendarLocked && !isCalendarHovered && !isAlertsOpen && !isQuickNavOpen

  let paddingLeft = 0
  if (isLocked) {
    if (windowWidth < 640) paddingLeft = 170
    else if (windowWidth < 850) paddingLeft = 210
    else if (windowWidth < 1024) paddingLeft = 220
    else paddingLeft = 224
  }

  return (
    <motion.div
      id="titlebar"
      className={`relative z-10 w-full h-8 flex items-center justify-between ${
        outline ? 'outline outline-1 outline-solid outline-neutral-800' : ''
      }`}
      initial={{ backgroundColor: 'rgba(0,0,0,0)', paddingLeft: 0 }}
      animate={{
        backgroundColor: isLocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)',
        paddingLeft
      }}
      transition={{ type: 'tween', duration: 0.3 }}
    > 
      {solidBackground && (
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ backgroundColor: '#141414' }}
        />
      )}
      <div className="absolute inset-0 drag" />

      {shouldShowHoverZone && (
        <div
          id="calendar-hover-zone"
          className="absolute top-0 h-full pointer-events-auto drag-exclude"
          style={{
            left: '35%',
            width: '30%',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={() => setIsCalendarHovered(true)}
          onMouseLeave={() => setIsCalendarHovered(false)}
        />
      )}

      <div id="left-bar" className="flex items-center m-3 drag-exclude min-w-0">
        <div className="flex items-center gap-2 drag-exclude min-w-0">
          <button
            id="logo"
            className="drag-exclude"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsLocked(false)}
          >
            <img
              src="assets/taskbar.png"
              alt="Logo"
              className="h-4 w-4 transition-transform duration-200 hover:scale-110"
            />
          </button>

{!isLocked && (
  <button
    id="sidebar"
    className={`relative w-5 h-5 flex items-center justify-center drag-exclude transition-transform duration-200 ${
      disableButton ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
    }`}
    onMouseEnter={() => !disableButton && setIsHovered(true)}
    onMouseLeave={() => !disableButton && setIsHovered(false)}
    onClick={() => {
      if (!disableButton) setIsLocked(true)
    }}
    disabled={disableButton}
  >
    <Menu
      className={`sidebar-icon ${isHovered ? 'icon-hidden' : 'icon-visible'}`}
      color="white"
      size={18}
      strokeWidth={0.9}
    />
    <ChevronsRight
      className={`sidebar-icon absolute transition-transform duration-200 hover:scale-110 ${
        isHovered ? 'icon-visible' : 'icon-hidden'
      }`}
      color="white"
      size={18}
      strokeWidth={2.25}
    />
  </button>
)}

          {(!isLocked || windowWidth >= 640) && (
            <p className="text-neutral-500 text-xs sm:text-sm leading-none font-raleway">
              {relativeTime} 
            </p>
          )}
        </div>

        <div id="c-b-cntr" className="flex items-center gap-3 ml-6">
          <div id="calendar-cntr" className="flex items-center drag-exclude">
            {!isCalendarLocked && (
              <button
  id="calendar"
  className={`relative flex items-center justify-center transition-transform duration-300 ease-out origin-center ${
    windowWidth < 600 ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
  } drag-exclude`}
  onMouseEnter={() => {
    if (windowWidth >= 600) setIsCalendarHovered(true)
  }}
  onMouseLeave={() => {
    if (windowWidth >= 600) setIsCalendarHovered(false)
  }}
  onClick={() => {
    if (windowWidth >= 600) setIsCalendarHovered(true)
  }}
  disabled={windowWidth < 600}
>
 <>
  <Calendar
    className={`calendar-icon ${
      isCalendarHovered && !isQuickNavOpen && !isAlertsOpen ? 'icon-hidden' : 'icon-visible'
    }`}
    color="white"
    size={17}
    strokeWidth={1}
  />
  <ChevronsDown
    className={`calendar-icon absolute transition-transform duration-300 ease-out ${
      isCalendarHovered && !isQuickNavOpen && !isAlertsOpen ? 'icon-visible' : 'icon-hidden'
    }`}
    color="white"
    size={20}
    strokeWidth={2.75}
  />
</>


</button>

            )}
          </div>

          <div id="alert-cntr" className="flex items-center drag-exclude">
            <button
              id="alert"
              className="flex items-center justify-center drag-exclude"
              onClick={() => {
                if (ontoggleAlerts) ontoggleAlerts()
              }}
            >
              <Bell color="white" size={18} strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </div>

      <div id="right-bar" className="flex items-center drag-exclude">
        <button
          id="nav-tog"
          className="w-5 h-5 flex items-center justify-center drag-exclude"
          onClick={() => {
            if (ontoggleQuickNav) ontoggleQuickNav()
          }}
        >
          <Hexagon color="white" size={16} strokeWidth={2} />
        </button>
        <div className="flex items-center border-l border-neutral-700 ml-5">
          <button
            id="minimize"
            onClick={() => window.ipcRenderer.send('minimize')}
            className="w-5 h-5 flex items-center justify-center hover:bg-neutral-800 rounded transition drag-exclude"
          >
            <Minus color="white" size={16} strokeWidth={2} />
          </button>
          <button
            id="maximize"
            onClick={() => window.ipcRenderer.send(isMaximized ? 'restore' : 'maximize')}
            className="w-5 h-5 flex items-center justify-center hover:bg-neutral-800 rounded transition drag-exclude"
          >
            {isMaximized ? (
              <PiCopy color="white" size={16} />
            ) : (
              <Square color="white" size={13} strokeWidth={2} />
            )}
          </button>
          <button
            id="close"
            onClick={() => window.ipcRenderer.send('close')}
            className="w-5 h-5 flex items-center justify-center drag-exclude"
          >
            <X color="white" size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
