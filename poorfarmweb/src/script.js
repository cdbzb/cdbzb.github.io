import './style.less'

// const audioSpareEl = document.querySelector (".spare")
// const audioEl = document.querySelector ("audio")
// const slideElPrev = document.querySelector (".prev")
// const slideEl = document.querySelector (".slide")
// const slideElNext = document.querySelector (".next")

// const slides = [ 
//     { background: "small/poorfarm-exterior.jpg"           } ,
//     { background: "small/beds-wide.jpg "                    , audio:'small/beds.wav.mp3' } , 
    
// // pipe room
//     { background: "small/pipe-room-head-on.jpg"             , audio:'small/descent-filtered.mp3' } , 
//     { background: "small/pipe-room1.jpg"                    , audio:'small/descent-filtered.mp3' } , 
//     { background: "small/pipe-room-paintings-oblique.jpg"   , audio:'small/descent-filtered.mp3' } , 

// // Video room 
//     { html: "<video src='small/front.mp4'> </video>" }  , 
//     { html: "<video src='small/back.mp4'> </video>" }  , 

// // bent mirror room
//     { background: 'small/bent-mirror-1.jpg'              , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-head-on.jpg'        , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-hi-res-angle.jpg'   , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-mask+dots.jpg'      , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-mask-and-door.jpg'  , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-mask-long.jpg'      , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-mask.jpg'           , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-mid.jpg'            , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-reverse.jpg'        , audio:'small/tapping2.mp3' } , 
//     { background: 'small/bent-mirror-room-from-hall.jpg' , audio:'small/tapping2.mp3' } , 

// // moon pool room 
//     { html: "<video src='small/Flitter Demo.mp4'> </video>" } , 
//     { background: 'small/moon-pool-hi-res.jpg'        , audio:'small/flitter.mp3' } , 
//     { background: 'small/moon-pool-long.jpg'        , audio:'small/flitter.mp3' } , 

// // pyramids
//     { background: 'small/pyramid-popsicle-high-res.jpg' } ,
//     { background: 'small/pyramids-looking-out.jpg' } ,
//     { background: 'small/pyramids-1.jpg' } ,
//     ]





// function getSlideBackground(n){
//     const slide=getSlide(n)
//     return slide.background ? "url(" + slide.background + ")" : ""
// }

// function playPauseSlideVideo(el,play){
//     const vid = el.querySelector("video")
//     if (vid) play ? vid.play() : vid.pause() 
// }

    
// function updateSlideEl(el,n,play) {
//     el.style.backgroundImage = getSlideBackground (n) 
//     el.innerHTML = getSlide (n).html || ""
//     playPauseSlideVideo(el,play)
// }

function animate (tick,finished,duration){
    let start 
    requestAnimationFrame ( t => {
        start = t 
        requestAnimationFrame(frame)
    })
    tick(0)
    function frame (t)  { 
        const elapsed = (t-start)/duration
        if (elapsed < 1)  {
            tick(elapsed)
            requestAnimationFrame(frame)
        } else {
            tick(1)
            finished()
        }
    }   
}

// let currentAudio

// function setAudio(filename){
//     if (filename == currentAudio) return
//     if (filename){
//         audioSpareEl.src = filename
//         audioSpareEl.volume = 0
//         audioSpareEl.play()
//     }
//     animate(t=>{ 
//         audioEl.volume=1-t
//         if (filename) audioSpareEl.volume=t
//     }, finished=> {
//         if (filename) {
//             audioEl.src = filename
//             audioEl.play()
//         } else {
//             audioEl.pause()
//         }

//         currentAudio = filename
//         audioEl.currentTime = audioSpareEl.currentTime
//         audioEl.volume = 1
//         audioSpareEl.volume = 0
//     } , 1500)

// }

// function setCurrentSlide( n ) {
//     currentSlide = n
//     // setAudio(getSlide(n).audio)
//     // updateSlideEl(slideElPrev,n-1,false)
//     // updateSlideEl(slideEl, n, true)
//     // updateSlideEl(slideElNext, n+1, false)
// }

// setCurrentSlide(0)


const slides = [...document.querySelectorAll('.slides > div')]

let currentSlide = 1

function getSlide(n){
    return slides[mod(n,slides.length)]
}

function mod( n , base ){
    return (n % base + base) % base 
}

function setCurrentSlide(n){
    slides.forEach(slide => slide.className = '')

    const leaving = getSlide(currentSlide)
    const entering = getSlide(n)

    // do the visual transition
    getSlide(n-1).className = 'prev'
    entering.className = 'current'
    getSlide(n+1).className = 'next'

    currentSlide = n

    const leavingAudio = leaving.querySelector('audio, video')
    const enteringAudio = entering.querySelector('audio, video')


    if (enteringAudio && enteringAudio.src
        && leavingAudio && leavingAudio.src
        && enteringAudio.src === leavingAudio.src) {

        enteringAudio.currentTime = leavingAudio.currentTime
        enteringAudio.volume = 1
        enteringAudio.play()
        
        animate(t=>{ 
            leavingAudio.volume=1-t
            enteringAudio.volume=t
        }, finished => {
            leavingAudio.pause()
        } , 500)

    } else if(enteringAudio || leavingAudio){
    
        if(enteringAudio) {
            enteringAudio.volume = 0
            enteringAudio.play()
        }

        animate(t=>{ 
            if (leavingAudio) leavingAudio.volume=1-t
            if (enteringAudio) enteringAudio.volume=t
        }, finished => {
            if(leavingAudio) {
                leavingAudio.pause()
                leavingAudio.currentTime = 0
            }
        } , 1500)
    }
}

        
document.addEventListener("click", e => {
    if(e.clientX > innerWidth /2) setCurrentSlide(currentSlide+1)
    else setCurrentSlide(currentSlide-1)
})


document.addEventListener("keydown",e => {
    if (e.keyCode == 37) {
        e.preventDefault()
        console.log("left")
        setCurrentSlide(currentSlide-1)
    } else if (e.keyCode == 39) {
        e.preventDefault()
        console.log("right")
        setCurrentSlide(currentSlide+1)
    }
})


