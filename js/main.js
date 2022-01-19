//REGISTER GSAP PLUGINS
gsap.registerPlugin(SplitText)
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(ScrollTrigger)
//gsap.registerPlugin(MorphSVG)
//gsap.registerPlugin(MorphSVGPlugin);
//REGISTER GSAP PLUGINS END

gsap.config({
  nullTargetWarn: false,
});


document.documentElement.className="js"; 
window.onbeforeunload = function () {
  window.scrollTo(0,0);
};

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
} 

// ==============================================================================
// HAMBURGER ANIMATION VARIABLES
const hamburger = document.querySelector(".hamburger")
const nav = document.querySelector("#nav")
const menuLinks = gsap.utils.toArray("#nav .nav-link");
const hambLine1 = hamburger.querySelector("span:first-of-type")
const hambLine2 = hamburger.querySelector("span:nth-of-type(2)")

// GET SIZE OF THE NAV
const nWidth = nav.offsetWidth
const nHeight = nav.offsetHeight

// GET SIZE OF BURGER
const hWidth = hamburger.offsetWidth
const hHeight = hamburger.offsetHeight

// HIDE NAV WITH LINKS
const menuAnimation = function() {
  gsap.set(menuLinks, {
    x: (i, target) => {
      return (i + 1) * 10 // 100, 200, 300
    },
    transformOrigin: "100% 0",
    opacity: 0,
  })
  gsap.set(nav, {
    width: hWidth,
    height: hHeight,
    padding: 0,
  })

  let hambAnim;
  const menuOpen = function() {
    setTimeout(function() {
      nav.classList.add("active")
    },400)
    hamburger.classList.add("active")

    if (hambAnim && hambAnim.isActive()) {
      hambAnim.progress(0);
    }
    hambAnim = gsap.timeline();
    hambAnim.to(nav, {
      width: nWidth,
      height: nHeight,
      padding: "4vw",
      duration: .4,
      ease: "power2.inOut"
    })
    hambAnim.to(menuLinks, {
      x: 0,
      stagger: .02,
      opacity: 1,
      duration: .4,
      ease: "power2.inOut"
    }, "-=.35")
    hambAnim.to(hambLine1, {
      rotate: 135,
      y: 0,
      duration: .4,
      ease: "power2.inOut"
    }, "-=.5")
    hambAnim.to(hambLine2, {
      rotate: -135,
      y: 0,
      duration: .4,
      ease: "power2.inOut"
    }, "-=.5")
  }

  // COLLAPSE MENU ON CLICK
  menuLinks.forEach(link => {
    link.addEventListener("click", function() {
      nav.classList.remove("active")
      hamburger.classList.remove("active")
      hambAnim.timeScale(2).reverse()
    })
  })

  if(!isMobile()){
      hamburger.addEventListener("mouseenter", function() {
        menuOpen()
      })
      nav.addEventListener("mouseleave", function() {
        nav.classList.remove("active")
        hamburger.classList.remove("active")
        hambAnim.timeScale(2).reverse()
      })
  } else {
    // MOBILE 
    hamburger.addEventListener("click", function() {
      if(hamburger.classList.contains("active")) {
        nav.classList.remove("active")
        hamburger.classList.remove("active")
        hambAnim.timeScale(2).reverse()
      } else {
        menuOpen()
      }
    })
  }
}
menuAnimation()
    
// ===========================================================================
// FIXED CONTACT VARIABLES
if($(".fixed-contact").length > 0) {
  const cIco = document.querySelector(".fixed-contact .icon")
  const cContent = document.querySelector(".fixed-contact .contact-content")
  const cTitle = cContent.querySelector("h5")
  const cAddress = cContent.querySelector("address")
  const cButton = cContent.querySelector(".button-wrap")

  // GET SIZE OF THE CONTACT CONTENT
  const cWidth = cContent.offsetWidth
  const cHeight = cContent.offsetHeight

  // GET SIZE OF CONTACT ICO
  const ciWidth = cIco.offsetWidth
  const ciHeight = cIco.offsetHeight

  if(window.innerWidth > 1024) {
      
      //console.log(cWidth, cHeight, ciWidth, ciHeight)

      // HIDE CONTACT PANE BY DEFAULT
      gsap.set(cContent, {
        width: ciWidth,
        height: ciHeight
      })
      gsap.set([cTitle, cAddress, cButton], {
        y: 20,
        opacity: 0
      })

      // RUN OUR ANIMATION ON MOUSE EVENTS
      let contactAnim;

      // ANIMATE ON HOVER
      cIco.addEventListener("mouseenter", function() {
        setTimeout(function() {
          cContent.classList.add("active")
        },400)
        cIco.classList.add("active")

        if (contactAnim && contactAnim.isActive()) {
          contactAnim.progress(0);
        }
        contactAnim = gsap.timeline();
        contactAnim.to(cContent, {
          duration: .4,
          width: cWidth,
          height: cHeight,
          ease: "power2.inOut"
        })
        contactAnim.to([cTitle, cAddress, cButton], {
          duration: .4,
          stagger: .1,
          opacity: 1,
          y: 0,
          ease: "power2.out"
        }, "-=.2")

      })

      // REMOVE ANIMATION
      cContent.addEventListener("mouseleave", function() {
        cContent.classList.remove("active")
        cIco.classList.remove("active")
        contactAnim.timeScale(2).reverse()
      })
    }
}


// ===========================================================
// PAGE INITS

PageInits = {

  initialScripts: function() {

      if(window.innerWidth > 1024){
        const locoScroll = new LocomotiveScroll({
          el: document.querySelector(".content"),
          smooth: true,
          scrollbarContainer:document.querySelector("#wrapper")

        });
        // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
        locoScroll.on("scroll", ScrollTrigger.update);

        // tell ScrollTrigger to use these proxy methods for the ".content" element since Locomotive Scroll is hijacking things
        ScrollTrigger.scrollerProxy(".content", {
          scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
          }, // we don't have to define a scrollLeft because we're only scrolling vertically.
          getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
          },
          // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform 
          //the content at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. 
          //We sense it by checking to see if there's a transform applied to the content (the LocomotiveScroll-controlled element).
          pinType: document.querySelector(".content").style.transform ? "transform" : "fixed"
        });


        // UPDATE LOCO SCROLL AFTER INIT
        setTimeout(function(){
          locoScroll.update()
        },500)

        // ACCORDION
        let acc = document.querySelectorAll(".acc-item ");
        let i;

        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {

          const panel = this.querySelector("div.acc-content");
          const acwrap = this.parentElement
          if (panel.style.height){
            panel.style.height = null;
            this.classList.remove("active");
          } else {
            let active = document.querySelectorAll(".acc-item.active");
            for(let j = 0; j < active.length; j++){
              const acTag = active[j].querySelector("div.acc-content")
              active[j].classList.remove("active");
              acTag.style.height = null;
            }
              this.classList.toggle("active");
              panel.style.height = panel.scrollHeight + "px";
            }
            setTimeout(function() {
              locoScroll.update()
            }, 600)
            
          });
        }


        // LOAD IMAGES AND THEN DO ANYTHING ELSE
        $('#wrapper').imagesLoaded( function() {
          if ($(".content").hasClass("home")) {
            
            // VARIABLES
            const logo = document.querySelector(".logo")
            const hamburger = document.querySelector(".hamburger")
            const nav = document.querySelector("#nav")
            const fixedContact = document.querySelector(".fixed-contact")
            const video = document.querySelector(".video")
            const initialSVG = document.querySelector(".initialSVG")
            const videoMask = document.querySelectorAll(".video-wrapper .morph")
            const playIcon = document.querySelector(".play-icon")
            const introTitle1 = document.querySelector("h1 div:first-of-type")
            const introTitle2 = document.querySelector("h1 div:nth-of-type(2)")
            let titleSplit1 = new SplitText(introTitle1, {type: "lines, words, chars"})
            let titleSplit2 = new SplitText(introTitle2, {type: "lines, words, chars"})
            const heroFix = document.querySelector(".hero-fix")

            // remove loading after preloading images
            document.body.classList.remove('loading');

            // UPDATE LOCO SCROLL AFTER INIT
            setTimeout(function(){
              locoScroll.update()
                
            },500)

            
            locoScroll.stop()

            // INTRO ANIMATION
            const introAnimation = function() {
              
              const introAnim = gsap.timeline({})

              introAnim.set([introTitle1, introTitle2], {perspective: 400})
              introAnim.set(video, {opacity: 0})
              introAnim.set(initialSVG, {opacity: 0, y: "40%"})
              introAnim.set([logo, hamburger, nav, fixedContact, heroFix], {opacity: 0})
              introAnim.set(playIcon, {rotation: -45, scale: .5, opacity: 0})

              
              introAnim.to(initialSVG, {
                opacity: 1,
                duration: .8,
                y: "20%",
                ease: "power4.out"
              })
              introAnim.to(initialSVG, {
                duration: 1.5,
                y: 0, 
                ease: "power4.inOut"
              })
              introAnim.to(videoMask, {
                morphSVG:".morphTo",
                duration: 1.25,
                ease: "power4.inOut"
              }, "-=1.5 ")
              introAnim.to(initialSVG, {
                opacity: 0,
                duration: .5,
                ease: "power4.out"
              },"-=.5")
              introAnim.to(video, {
                opacity: 1,
                duration: .5,
                ease: "power4.out"
              }, "-=.5")
              introAnim.from(titleSplit1.chars, {
                opacity: 0,
                duration: .6,
                y: "50%",
                skewX: -30,
                stagger: 0.005,
                transformOrigin: "0% 0% 0%",
                rotationX: -30,
                ease: "power3",
              }, "-=.4")
              introAnim.from(titleSplit2.chars, {
                opacity: 0,
                duration: .6,
                y: "50%",
                skewX: -30,
                stagger: 0.01,
                transformOrigin: "0% 0% 0%",
                rotationX: -30,
                ease: "power3",
              }, "-=.6")
              introAnim.to([logo, hamburger, nav, fixedContact, heroFix], {
                opacity: 1,
                duration: .5,
                ease: "power4"
              }, "-=.5")
              introAnim.to(playIcon, {
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: .5,
                ease: "power4",
                onComplete: inject
              }, "-=.5")
            }

            // RUN INTRO ANIMATION
            introAnimation()

            //run smoothscroll once the intro animation has been completed
            function inject() {
              locoScroll.start()
            }

            // FIX HEADER ASIDE
            const winHeight = window.innerHeight
            const hfHeight = heroFix.offsetHeight
            const hfTop = heroFix.getBoundingClientRect().top
            const hfPos = -hfTop + winHeight - (hfHeight / 3.3)

            gsap.set(heroFix, {
              y: hfPos,
              transformOrigin: "0 0",
              scale: .33
            })

            gsap.to(heroFix, {
              scrollTrigger: {
                start: 'top 120%',
                scroller: ".content",
                toggleActions: "restart restart restart restart",
                end: 'bottom 100%',
                trigger: "#services",
                scrub: true
              },
              y: "",
              transformOrigin: "0 0",
              scale: 1,
              ease: "linear"
            })
          }  else {
            // remove loading after preloading images
            document.body.classList.remove('loading');

            // UPDATE LOCO SCROLL AFTER INIT
            setTimeout(function(){
              locoScroll.update()
            },500)
          } 
          // END IF HOME CLASS
        });
        //END WRAPPER FUNCTION
      } else {
        $('#wrapper').imagesLoaded( function() {
          if ($(".content").hasClass("home")) {
            
            // VARIABLES
            const logo = document.querySelector(".logo")
            const hamburger = document.querySelector(".hamburger")
            const nav = document.querySelector("#nav")
            const fixedContact = document.querySelector(".fixed-contact")
            const video = document.querySelector(".video")
            const initialSVG = document.querySelector(".initialSVG")
            const videoMask = document.querySelectorAll(".video-wrapper .morph")
            const playIcon = document.querySelector(".play-icon")
            const introTitle1 = document.querySelector("h1 div:first-of-type")
            const introTitle2 = document.querySelector("h1 div:nth-of-type(2)")
            let titleSplit1 = new SplitText(introTitle1, {type: "lines, words, chars"})
            let titleSplit2 = new SplitText(introTitle2, {type: "lines, words, chars"})

            // remove loading after preloading images
            document.body.classList.remove('loading');
            
            // INTRO ANIMATION
            const introAnimation = function() {
              
              const introAnim = gsap.timeline({})

              introAnim.set([introTitle1, introTitle2], {perspective: 400})
              introAnim.set(video, {opacity: 0})
              introAnim.set(initialSVG, {opacity: 0, y: "40%"})
              introAnim.set([logo, hamburger, nav, fixedContact], {opacity: 0})
              introAnim.set(playIcon, {rotation: -45, scale: .5, opacity: 0})

              
              introAnim.to(initialSVG, {
                opacity: 1,
                duration: .8,
                y: "20%",
                ease: "power4.out"
              })
              introAnim.to(initialSVG, {
                duration: 1.5,
                y: 0, 
                ease: "power4.inOut"
              })
              introAnim.to(videoMask, {
                morphSVG:".morphTo",
                duration: 1.25,
                ease: "power4.inOut"
              }, "-=1.5 ")
              introAnim.to(initialSVG, {
                opacity: 0,
                duration: .5,
                ease: "power4.out"
              },"-=.5")
              introAnim.to(video, {
                opacity: 1,
                duration: .5,
                ease: "power4.out"
              }, "-=.5")
              introAnim.from(titleSplit1.chars, {
                opacity: 0,
                duration: .6,
                y: "50%",
                skewX: -30,
                stagger: 0.005,
                transformOrigin: "0% 0% 0%",
                rotationX: -30,
                ease: "power3",
              }, "-=.4")
              introAnim.from(titleSplit2.chars, {
                opacity: 0,
                duration: .6,
                y: "50%",
                skewX: -30,
                stagger: 0.01,
                transformOrigin: "0% 0% 0%",
                rotationX: -30,
                ease: "power3",
              }, "-=.6")
              introAnim.to([logo, hamburger, nav, fixedContact], {
                opacity: 1,
                duration: .5,
                ease: "power4"
              }, "-=.5")
              introAnim.to(playIcon, {
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: .5,
                ease: "power4",
              }, "-=.5")
            }

            // RUN INTRO ANIMATION
            introAnimation()

          }   
          else {
            $('#wrapper').imagesLoaded( function() {
              document.body.classList.remove('loading');
            })
          }
          // END IF HOME CLASS
        });
        //END WRAPPER FUNCTION
      }
      // END IF WINDOW 1024px
      // remove loading after preloading images

  },

  introAnimation: function() {
    
  },

  mainScripts: function() {

    // =========================================================================================================
    // ACCORDION
    // =========================================================================================================
    if(isMobile() && document.querySelectorAll(".acc-item ")) {
      let acc = document.querySelectorAll(".acc-item ");
      let i;

      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        const panel = this.querySelector("div.acc-content");
        const acwrap = this.parentElement
        if (panel.style.height){
          panel.style.height = null;
          this.classList.remove("active");
        } else {
          let active = document.querySelectorAll(".acc-item.active");
          for(let j = 0; j < active.length; j++){
            const acTag = active[j].querySelector("div.acc-content")
            active[j].classList.remove("active");
            acTag.style.height = null;
          }
            this.classList.toggle("active");
            panel.style.height = panel.scrollHeight + "px";
          }
          
        });
      }
    }

    // =========================================================================================================
    // VIDEO AUTOPLAY IN VIEWPORT
    // =========================================================================================================
    if ($(".video").length > 0 ) {

      const checkVideo = function() {
        document.querySelectorAll('.video').forEach(video => {
          if(
              video.getBoundingClientRect().top < window.innerHeight &&
              video.getBoundingClientRect().top + video.clientHeight > 0
          ){
            video.play(); 

          } else if(
            video.getBoundingClientRect().top > window.innerHeight ||
            video.getBoundingClientRect().top + video.clientHeight < 0
          ){
            video.pause();  
          }

        }) 
        requestAnimationFrame(checkVideo)
      }
      checkVideo()
      
    }

    // =========================================================================================================
    // PAGE COLOR CHANGE
    // =========================================================================================================
    if($(".bgChange").length > 0) {
      const bodyTag = document.querySelector("body")
      const colorTrigger = document.querySelector(".bgChange")
      const textElem = gsap.utils.toArray('.colorChange');
      const spiral = document.querySelector(".spiral img")

      if(window.innerWidth > 1024) {
        const bgText = gsap.timeline({
          scrollTrigger: {
            trigger: colorTrigger,
            start: 'top top',
            scroller: ".content",
            toggleActions: "play reverse play reverse",
            end: 'bottom top'
            //scrub: true,
          }
        })
        const bgAnim = gsap.timeline({
          scrollTrigger: {
            trigger: colorTrigger,
            start: 'top 20px',
            scroller: ".content",
            toggleActions: "play reverse play reverse",
            end: 'bottom top',
            pin: colorTrigger,
            scrub: false
          }
        })
        bgAnim.to(bodyTag, {
          backgroundColor: "#ffffff",
          duration: .4,
          ease: "linear"
        })
        bgAnim.to(textElem, {
          color: "#111211",
          duration: .4,
          ease: "linear"
        }, "-=.4")
        bgAnim.from(spiral, {
          opacity: 0,
          duration: .4,
          ease: "linear"
        }, "-=.2")
        bgText.to(spiral, {
          rotationZ: 360,
          repeat: -1,
          duration: 8,
          ease: "linear"
        })
        
      } else {
        const bgText = gsap.timeline({
          scrollTrigger: {
            trigger: colorTrigger,
            start: 'top top',
            scroller: "body",
            toggleActions: "play reverse play reverse",
            end: 'bottom top'
            //scrub: true,
          }
        })
        const bgAnim = gsap.timeline({
          scrollTrigger: {
            trigger: colorTrigger,
            start: 'top 20px',
            scroller: "body",
            toggleActions: "play reverse play reverse",
            end: 'bottom top',
            //pin: colorTrigger,
            scrub: false
          }
        })
        bgAnim.to(bodyTag, {
          backgroundColor: "#ffffff",
          duration: .4,
          ease: "linear"
        })
        bgAnim.to(textElem, {
          color: "#111211",
          duration: .4,
          ease: "linear"
        }, "-=.4")
        bgAnim.from(spiral, {
          opacity: 0,
          duration: .4,
          ease: "linear"
        }, "-=.2")
        bgText.to(spiral, {
          rotationZ: 360,
          repeat: -1,
          duration: 8,
          ease: "linear"
        })
      }
    }

    //================================================================
    // TEXT ANIMATIONS
    //================================================================
    const titleTag = gsap.utils.toArray('.split');
    titleTag.forEach(split => {
      let titleSplit = new SplitText(split, {type: "lines, words, chars"})

      if(!split.classList.contains("line")) {
        gsap.set(titleSplit.chars, {
          opacity: 0,
          y: "50%"
        })
        ScrollTrigger.batch(titleSplit.chars, {
          scroller: ".content",
          start: "top 90%",
          onEnter: batch => gsap.to(batch, {
            opacity: 1,
            duration: .8,
            y: 0,
            stagger: 0.01,
            ease: "power3"
          }),
        });
      } else {
        gsap.set(titleSplit.lines, {
          opacity: 0,
          y: "100%"
        })
        ScrollTrigger.batch(titleSplit.lines, {
          scroller: ".content",
          start: "top 90%",
          onEnter: batch => gsap.to(batch, {
            opacity: 1,
            duration: .8,
            y: 0,
            stagger: 0.1,
            ease: "power3"
          }),
        });
      }
    })
    


    //================================================================
    // PLAY ICON ROTATION LOOP AND HOVER PLUS VIDEO MODAL
    //================================================================
    if($(".play-icon").length > 0) {
      const playIcon = document.querySelector(".play-icon")
      const closeTag = document.querySelector(".vid-close")
      const closeLine1 = closeTag.querySelector("span:first-of-type")
      const closeLine2 = closeTag.querySelector("span:nth-of-type(2)")
      const vidModal = document.querySelector(".video-modal")
      const playIconBg = document.querySelector(".play-icon span")
      const playText = playIcon.querySelector("img:first-of-type")
      const playArrow = playIcon.querySelector("img:nth-of-type(2)")
      const video = document.querySelector("#full-video");

      gsap.set(video, {opacity: 0})
      
      gsap.to(playText, {
        rotation: 360,
        duration: 10,
        ease: "linear",
        repeat: -1
      })

      gsap.set([closeLine1, closeLine2], {
        scaleX: 0,
        x: 10,
        y: "-50%",
        rotateZ: 0
      })

      playIcon.addEventListener("mouseenter", function() {
        gsap.to(playIconBg, {
          scale: 1.1,
          duration: .4,
          ease: "power4"
        })
      })
      playIcon.addEventListener("mouseleave", function() {
        gsap.to(playIconBg, {
          scale: 1,
          duration: .4,
          ease: "power4"
        })
      })
      
      // VIDEO MODAL OPEN
      const vidOpen = function() {
        gsap.set(video, {opacity: 0, y: 50, scale: .9})
        video.currentTime = 0;

        const vidPlay = function() {
          video.play();
        }   
        const openVideo = gsap.timeline()
        
        openVideo.to(vidModal, {
          y: 0,
          duration: 1,
          ease: Expo.easeInOut,
          onComplete: vidPlay
        })
        openVideo.to(video, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: .75,
          ease: "power4",
          onComplete: vidPlay
        }, "-=.1")
        openVideo.to(closeLine1, {
          rotateZ: 45,
          x: 10,
          y: "-50%",
          scaleX: 1,
          duration: .4,
          ease: "power4",
        }, "-=.5")
        openVideo.to(closeLine2, {
          rotateZ: -45,
          x: 10,
          y: "-50%",
          scaleX: 1,
          duration: .4,
          ease: "power4",
        }, "-=.4")
      }

      // VIDEO MODAL CLOSE
      const vidClose = function() {

        const vidStop = function() {
          video.pause();
        }   
        const closeVideo = gsap.timeline()
        
        closeVideo.to(video, {
          opacity: 0,
          scale: .9,
          y: -50,
          duration: .5,
          ease: "power4",
          onComplete: vidStop
        })
        closeVideo.to(vidModal, {
          y: "-100%",
          duration: 1,
          ease: Expo.easeInOut,
        }, "-=.5")
        closeVideo.to(closeLine1, {
          rotateZ: 0,
          x: 10,
          y: "-50%",
          scaleX: 0,
          duration: .4,
          ease: "power4",
        }, "-=1")
        closeVideo.to(closeLine2, {
          rotateZ: 0,
          x: 10,
          y: "-50%",
          scaleX: 0,
          duration: .4,
          ease: "power4",
        }, "-=1")
      }

      playIcon.addEventListener("click", function(){
        // APPEND SOURCE ATTRIBUTES
        const source1 = document.createElement('source');
        const source2 = document.createElement('source');

        source1.setAttribute('src', 'img/intro-comp.mp4');
        source1.setAttribute('type', 'video/mp4');
        source2.setAttribute('src', 'img/intro-comp.ogg');
        source2.setAttribute('type', 'video/ogg');
        video.append(source1, source2);

        vidOpen()

      })

      closeTag.addEventListener("click", function(){
        const removeSource = video.querySelectorAll("source")
        removeSource.forEach(src => {
          src.remove()
        })
        vidClose()

      })
    }

    //================================================================
    // ANIMATE SVG ARROW IN VIEWPORT
    //================================================================
    if($(".animate").length > 0) {
      const svg = gsap.utils.toArray(".draw")
          
      svg.forEach(item => {
        const svgPath = item.querySelectorAll(".animate")
        gsap.set(svgPath, {drawSVG: "0%"})

        gsap.to(svgPath, {
          scrollTrigger: {
            trigger: svgPath,
            scroller: ".content",
            start: "top 60%",
          },
          drawSVG: "100%",
          duration: 1,
          delay: -.5,
          ease: "power3.out"
        })
      })

    }

    //================================================================
    // PORTFOLIO HOVER
    //================================================================
    if(document.querySelector("#portfolio")) {

      const pLink = gsap.utils.toArray(".work a")
      const work = document.querySelector(".work")
      const pImage = document.querySelector("#portfolio image")
      //const pImage = document.querySelector("#portfolio image")
      //const pMask = document.querySelector("#portfolio .pMask")
      //const pPath = document.querySelector("#portfolio .pathMorph")
      const morphMask = gsap.utils.toArray(".pMask")
      gsap.set("#portfolio image", {
        opacity: 0
      })

      work.addEventListener("mouseenter", function() {
        work.classList.add("entered")
      })
       work.addEventListener("mouseleave", function() {
        work.classList.remove("entered")
      })


      pLink.forEach(link => {

        const dataNo = link.dataset.item
        const selectImage = document.querySelector('[data-img="' + dataNo + '"]');
        const selectPath = document.querySelector('[data-path="' + dataNo + '"]');
        
        link.addEventListener("mouseenter", function() {
          link.classList.add("active")
          //gsap.to(link, {color: "#fff", duration: .5, ease: "power4"})
          gsap.to(selectImage, {opacity: 1, duration: .6, ease: "power4"})
          gsap.to(morphMask, {morphSVG: selectPath, duration: .6, ease: "power4"})

        })

        link.addEventListener("mouseleave", function() {
          link.classList.remove("active")
          //gsap.to(link, {color: "#928D7C", duration: .5, ease: "power4"})
          gsap.to(selectImage, {opacity: 0, duration: .6, ease: "power4"})
          gsap.to(morphMask, {morphSVG: ".pOriginal", duration: .6, ease: "power4"})

        })

      })

    } // END IF

    //================================================================
    // MEDIA SCROLL
    //================================================================
    if($("#media").length > 0 && window.innerWidth > 1024) {
      const media = document.querySelector("#media")
      const mediaItem = gsap.utils.toArray("#media article.post")

      gsap.set(mediaItem, {
        y: (index) => {
          return (index + 1) * 100 // 100, 200, 300
        },
      })

      const mediaScroll = gsap.timeline({
        scrollTrigger: {
          trigger: media,
          start: "top 70%",
          end: "bottom 30%",
          scroller: ".content",
          toggleActions: "play none reverse none",
          scrub: true
        }
      })

      mediaScroll.to(mediaItem, {
        y: (index) => {
          return (index + 1) * -100 // 100, 200, 300
        },
        ease: "linear"
      })

    }



    //================================================================
    // PILLARS FIXED
    //================================================================
    if($("#pillars").length > 0 && window.innerWidth > 1024) {  
      const scrollAside = document.querySelector("#pillars aside")
      const swapItem = document.querySelector(".words-swap h2")
      const swapList = gsap.utils.toArray(".words-swap .swap-item")
      const swapChange = gsap.utils.toArray(".words-swap .swap-change")
      const swapHeight = swapItem.offsetHeight
      const swapFraction = swapHeight / 5

      const saWidth = scrollAside.offsetWidth
      const sectionWidth = document.querySelector("#pillars").offsetWidth
      //console.log(sectionWidth)

      gsap.set(swapList, {y: "100%", transformOrigin: "top left",})

      const swapScroll = gsap.timeline({
        scrollTrigger: {
          trigger: "#pillars",
          scroller: ".content",
          start: "top top",
          end: "bottom -=250%",
          toggleActions: "play none reverse none",
          pin: "#pillars",
          //markers: true,
          scrub: true
        }
      })

      gsap.to(scrollAside, {
        scrollTrigger: {
          trigger: "#pillars",
          scroller: ".content",
          start: "top top",
          end: "bottom -=250%",
          toggleActions: "play none reverse none",
          pin: "#pillars",
          //markers: true,
          scrub: true
        },
        x: -sectionWidth + saWidth,
        ease: "linear"
      })

      swapChange.forEach(item => {
        swapScroll.to(item, {
          y: "0%", opacity: 1, ease: "power2.inOut", delay:-.9, duration: 1
        })
        swapScroll.to(item, {
          y: "-100%", ease: "power2.inOut", delay: 1,  duration: 1
        })
      })
      swapScroll.to(".words-swap .no-change", {
        y: "0%", transformOrigin: "top left", rotateZ: 0, skewX: 0,  duration: 1, opacity: 1, ease: "power2.inOut", delay: -.9
      })
    }

    // BALL FOLLOW
    // PLAY PAUSE DIV FOLLOW
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if(isSafari){ 

    } else {
      if(document.querySelector("#ball") && window.innerWidth > 1024) {
        const ball = document.querySelector("#ball")
        const minus = ball.querySelector(".inner span:first-of-type")
        const plus = ball.querySelector(".inner span:nth-of-type(2)")
        const accItems = document.querySelectorAll("ul.acc-wrapper li")

        let mouseX = 0
        let mouseY = 0
        let ballX = 0
        let ballY = 0
        let ballSpeed = .5

        function animateBall() {
          let distX = mouseX - ballX
          let distY = mouseY - ballY

          ballX = ballX + (distX * ballSpeed)
          ballY = ballY + (distY * ballSpeed)

          const centerHeight = ball.offsetHeight / 2
          const centerWidth = ball.offsetWidth / 2

          gsap.to(ball, {
            y: ballY - centerHeight,
            x: ballX - centerWidth,
            ease: "none",
            duration: .1
          })

          //ball.style.transform = `translateX(${ballX - centerWidth}px) translateY(${ballY - centerHeight}px) `
          requestAnimationFrame(animateBall)
        }
        animateBall()


       // APPEAR ON PROJECT ENTER
       const accArea = document.querySelector("ul.acc-wrapper")
        accArea.addEventListener("mouseenter", function() {
          ball.classList.add("show")
          mouseX = event.pageX
          mouseY = event.clientY
        })
        accArea.addEventListener("mouseleave", function() {
          ball.classList.remove("show")
        })
        accArea.addEventListener("mousemove", function (e) {
          mouseX = event.pageX
          mouseY = event.clientY
        })
        // CHANGE STATE OF THE BALL PLUS MINUS
        accItems.forEach(item => {
          item.addEventListener("mousemove", function() {
            item.classList.add("hovered")
            if(item.classList.contains("active")) {
              gsap.to(plus, {rotateZ: 0, duration: .3, backgroundColor:"#DEA940" , ease: "power3"})
              gsap.to(minus, {backgroundColor:"#DEA940" , ease: "power3"})
              gsap.to(ball, {backgroundColor: "#111211", duration: .3, ease: "power3"})
            } else {
               gsap.to(plus, {rotateZ: 90, duration: .3, backgroundColor: "#111211", ease: "power3"})
               gsap.to(minus, {backgroundColor:"#111211" , ease: "power3"})
               gsap.to(ball, {backgroundColor: "#DEA940", duration: .3, ease: "power3"})
            }
          })
          item.addEventListener("click", function() {
            if(item.classList.contains("active")) {
              gsap.to(plus, {rotateZ: 0, duration: .3, backgroundColor:"#DEA940" , ease: "power3"})
              gsap.to(minus, {backgroundColor:"#DEA940" , ease: "power3"})
              gsap.to(ball, {backgroundColor: "#111211", duration: .3, ease: "power3"})
            } else {
               gsap.to(plus, {rotateZ: 90, duration: .3, backgroundColor: "#111211", ease: "power3"})
               gsap.to(minus, {backgroundColor:"#111211" , ease: "power3"})
               gsap.to(ball, {backgroundColor: "#DEA940", duration: .3, ease: "power3"})
            }
          })
          item.addEventListener("mouseleave", function() {
            item.classList.remove("hovered")
          })
        })


      }
    }
     // PILLARS END

    //================================================================
    // APPEAR ITEMS IN VIEWPORT
    //================================================================
    if($(".view").length > 0) {
      gsap.set(".view", {opacity: 0, y: "10vh"})

      ScrollTrigger.batch(".view", {
        scroller: ".content",
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          duration: .9,
          y: 0,
          stagger: 0.2,
          ease: "power3.out"
        }),
      });

    }
    // END VIEWPORT ITEMS

    //================================================================
    // BOTTOM CONTACT ANIMATION
    //================================================================
    if($("#bottom-contact").length > 0) {
      if(window.innerWidth > 1024) {
        const bcPillars = gsap.timeline({
          scrollTrigger: {
            trigger: "#bottom-contact",
            start: 'top 80%',
            scroller: ".content",
            toggleActions: "play pause resume pause",
            end: 'bottom top',
            //scrub: true,
          }
        })
        bcPillars.to(".pm", {
          scaleY: 2,
          duration: 1,
          transformOrigin: "0 50%",
          ease: "power2.inOut",
          stagger: {
            from: "center",
            yoyo: true,
            repeat: -1,
            amount: .3
          }
        })
      } else {
        const bcPillars = gsap.timeline({
          scrollTrigger: {
            trigger: "#bottom-contact",
            start: 'top 80%',
            scroller: "body",
            toggleActions: "play pause resume pause",
            end: 'bottom top',
            //scrub: true,
          }
        })
        bcPillars.to(".pm", {
          scaleY: 6,
          duration: 1,
          transformOrigin: "0 50%",
          ease: "power2.inOut",
          stagger: {
            from: "center",
            yoyo: true,
            repeat: -1,
            amount: .3
          }
        })
      }
    }


    //================================================================
    // ABOUT CHECK BOXES ANIMATION
    //================================================================
    if($(".check").length > 0) {
      const checkTag = document.querySelector(".check")
      checkTag.style.paddingBottom = "300px"

      const checkSpread = gsap.timeline({
        scrollTrigger: {
          trigger: ".check article",
          scroller: ".content",
          start: "top 60%",
          end: "bottom 30%",
          toggleActions: "play none reverse none",
          //pin: checkTag,
          //markers: true,
          scrub: true
        },
      })
      checkSpread.to(".check article", {
        y: (index) => {
          return (index + 1) * 100 // 100, 200, 300
        },
        ease: "linear"
      })

    }
    // END CHECK

    //================================================================
    // PH SIDE SLIDER
    //================================================================
    if($("#ph-slider").length > 0 && window.innerWidth > 1024) {
      const phSlider = document.querySelector("#ph-slider")
      const phInner = phSlider.querySelector(".slider-inner")
      const phItems = phSlider.querySelectorAll(".slide-item")

      // GET width of the slider items
      let totalWidth = 0;
      for (let i = 0; i < phItems.length; i++) {
          totalWidth += phItems[i].offsetWidth;
      }
      // Set the width of the wrapper
      phInner.style.width = totalWidth + "px"

    }
  },

  dragSlider: function() {
      if(!isMobile() && $("#ph-slider").length > 0) {

      // SLIDER
      function _getClosest(item, array, getDiff) {
          var closest,
              diff;

          if (!Array.isArray(array)) {
              throw new Error("Get closest expects an array as second argument");
          }

          array.forEach(function (comparedItem, comparedItemIndex) {
              var thisDiff = getDiff(comparedItem, item);

              if (thisDiff >= 0 && (typeof diff == "undefined" || thisDiff < diff)) {
                  diff = thisDiff;
                  closest = comparedItemIndex;
              }
          });

          return closest;
      }


      function number(item, array) {
        return _getClosest(item, array, function (comparedItem, item) {
          return Math.abs(comparedItem - item);
        });
      }
          
      function lerp(a, b, n) {
          return (1 - n) * a + n * b
      }

      class Slider {
        constructor(options = {}) {
          this.bind()
          
          this.opts = {
            el: options.el || '#ph-slider',
            ease: options.ease || 0.1,
            speed: options.speed || 1.25,
            velocity: 20,
            scroll: options.scroll || false
          }
          
          this.slider = document.querySelector('#ph-slider')
          this.sliderInner = this.slider.querySelector('.slider-inner')
          this.slides = [...this.slider.querySelectorAll('.slide-item')]
          this.slidesNumb = this.slides.length
          
          this.rAF = undefined
          
          this.sliderWidth = 0
          
          this.onX = 0
          this.offX = 0
          
          this.currentX = 0
          this.lastX = 0
          
          this.min = 0
          this.max = 0

          this.centerX = window.innerWidth / 2
        }
        
        bind() {
          ['setPos', 'run', 'on', 'off', 'resize'].forEach((fn) => this[fn] = this[fn].bind(this))
        }
        
        setBounds() {
          const bounds = this.slides[0].getBoundingClientRect()
          const slideWidth = bounds.width
          

          this.sliderWidth = this.slidesNumb * slideWidth
          this.max = -(this.sliderWidth - window.innerWidth)

          this.slides.forEach((slide, index) => {
            slide.style.left = `${index * slideWidth}px`
          })
        }


        setPos(e) {
          if (!this.isDragging) return
          this.currentX = this.offX + ((e.clientX - this.onX) * this.opts.speed)
          this.clamp()
        }

        clamp() {
          this.currentX = Math.max(Math.min(this.currentX, this.min), this.max)
        }
        
        run() {
          this.lastX = lerp(this.lastX, this.currentX, this.opts.ease)
          this.lastX = Math.floor(this.lastX * 100) / 100

          const sd = this.currentX - this.lastX
          const acc = sd / window.innerWidth
          let velo =+ acc
          
          this.sliderInner.style.transform = `translate3d(${this.lastX}px, 0, 0) skewX(${velo * this.opts.velocity}deg)`

          this.requestAnimationFrame()
        }
        
        on(e) {
          this.isDragging = true
          this.onX = e.clientX
          this.slider.classList.add('is-grabbing')

        }
        
        off(e) {
          //this.snap()
          this.isDragging = false
          this.offX = this.currentX
          this.slider.classList.remove('is-grabbing')
        }
        
        closest() {
          const numbers = []
          this.slides.forEach((slide, index) => {
            const bounds = slide.getBoundingClientRect()
            const diff = this.currentX - this.lastX
            const center = (bounds.x + diff) + (bounds.width / 2)
            const fromCenter = this.centerX - center
            numbers.push(fromCenter)
          })

          let closest = number(0, numbers)
          closest = numbers[closest]
          
          return {
            closest
          }
        }

        /*snap() {
          const { closest } = this.closest()
          
          this.currentX = this.currentX + closest
          this.clamp()
        }*/

        requestAnimationFrame() {
          this.rAF = requestAnimationFrame(this.run)
        }

        cancelAnimationFrame() {
          cancelAnimationFrame(this.rAF)
        }
        
        addEvents() {
          this.run()
          
          this.slider.addEventListener('mousemove', this.setPos, { passive: true })
          this.slider.addEventListener("touchmove", this.setPos, { passive: true });

          this.slider.addEventListener('mousedown', this.on, false)
          this.slider.addEventListener("touchstart", this.on, false);
          this.slider.addEventListener('mouseup', this.off, false)
          this.slider.addEventListener('touchend', this.off, false)
          this.slider.addEventListener('mouseleave', this.off, false)
          
          window.addEventListener('resize', this.resize, false)
        }
        
        removeEvents() {
          this.cancelAnimationFrame(this.rAF)
          
          this.slider.removeEventListener('mousemove', this.setPos, { passive: true })
          this.slider.addEventListener("touchmove", this.setPos, { passive: true });
          this.slider.removeEventListener('mousedown', this.on, false)
          this.slider.addEventListener("touchstart", this.on, false);
          this.slider.removeEventListener('mouseup', this.off, false)
          this.slider.addEventListener('touchend', this.off, false)
          this.slider.removeEventListener('mouseleave', this.off, false)
        }
        
        resize() {
          this.setBounds()
        }
        
        destroy() {
          this.removeEvents()
          
          this.opts = {}
        }
        
        init() {
          this.setBounds()
          this.addEvents()
        }
      }

      const slider = new Slider()
      slider.init()
      // END Slider

      // ============================================================================================
      // DRAGGABLE LOTTIE + drag move
      // ============================================================================================

      const dragCursor = document.querySelector("#drag-ico")
      const dragArea = document.querySelector("#ph-slider")
      gsap.set(dragCursor, {opacity: 0})

      let dragLottie = lottie.loadAnimation({
        container: document.querySelector("#drag-ico"), // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'js/lottie/drag-hover.json',
        rendererSettings: {
          preserveAspectRatio: 'none', // Supports the same options as the svg element's preserveAspectRatio property
          progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
          hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
          className: 'lottie'
        }
      });
      dragLottie.stop()

      // DRAG FOLLOW
      let mouseX = 0
      let mouseY = 0
      let ballX = 0
      let ballY = 0
      let ballSpeed = .12

      function dragMove() {
        let distX = mouseX - ballX
        let distY = mouseY - ballY

        ballX = ballX + (distX * ballSpeed)
        ballY = ballY + (distY * ballSpeed)

        const centerHeight = dragCursor.offsetHeight / 2
        const centerWidth = dragCursor.offsetWidth / 2

        gsap.to(dragCursor, {
          y: ballY - centerHeight,
          x: ballX - centerWidth,
          ease: "none",
          duration: .05
        })
        requestAnimationFrame(dragMove)
      }
      dragMove()

      // END LOTTIE
      const sliderArea = document.querySelector("#ph-slider")
      sliderArea.addEventListener("mouseenter", function() {
        gsap.to(dragCursor, {opacity: 1, duration: .2, ease: "power2"})
      })
      sliderArea.addEventListener("mousedown", function() {
        dragLottie.setDirection(1)
        dragLottie.play()
      })
      sliderArea.addEventListener("mouseup", function() {
        dragLottie.setDirection(-1);  
        dragLottie.play()
      })
      sliderArea.addEventListener("mouseleave", function() {
        gsap.to(dragCursor, {opacity: 0, duration: .2, ease: "power2"})
        dragLottie.setDirection(-1);  
        dragLottie.play()
      })
      sliderArea.addEventListener("mousemove", function() {
        mouseX = event.pageX
        mouseY = event.clientY
      })
      // END DRAGGABLE LOTTIE WITH DRAG MOVE
      
    }

  }, 
    
} 


PageInits.initialScripts()
PageInits.introAnimation()
PageInits.mainScripts()
PageInits.dragSlider()


///////////////////////////////////////////////////////
//////////////////// SMOOTHSTATE ///////////////////////////

// Outter link click
$('.nav-link').click(function(e){
    e.preventDefault();
    var content  = $('#wrapper').smoothState().data('smoothState');
    var href = $(this).attr('href');
    content.load(href);
});

// Smoothstate function
$(function(){
  'use strict';

  var options = {
    prefetch: true,
    cacheLength: 2,
    onStart: {
      duration: 1550, // Duration of our animation
      render: function ($container) {
        // Add your CSS animation reversing class
        $container.addClass('is-exiting');
        // Restart your animation
        smoothState.restartCSSAnimations();

      }
    },
    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        // Remove your CSS animation reversing class
        $container.removeClass('is-exiting pending');
        $container.addClass('is-animating');

        // Inject the new content
        $container.html($newContent);

      } 
    },
    onAfter: function($container, $newContent) {
        $container.removeClass('is-animating'); 

        // RERUN SCRIPTS
        PageInits.initialScripts()
        PageInits.introAnimation()
        PageInits.mainScripts()

    },
  },
  smoothState = $('#wrapper').smoothState(options).data('smoothState');
});
    






