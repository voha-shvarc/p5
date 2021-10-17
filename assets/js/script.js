function Slide(index, title, background, link) {
    this.title = title;
    this.background = background;
    this.link = link;
    this.id = "slide-" + index;
}

const Slider = {
    current: 0,
    isVisible: true,
    slides: [],
    initSlider: function (slides) {
        let index = 0;
        for (let slide of slides) {
            this.slides.push(new Slide(index, slide.title, slide.background, slide.link));
            index++;
        }
        this.buildSlider();
    },
    buildSlider: function () {
        let sliderHTML = "";
        let sliderIndexesHTML = "";
        for (let slide of this.slides) {
            //зверніть увагу на можливість використання ``,яка дозволяє додавати в string змінні ${}
            sliderHTML +=
                `<div id='${slide.id}' class='singleSlide'
            style='background-image:url(${slide.background});'>
            <div class='slideOverlay'>
            <h2>${slide.title}</h2>
            <a class='link' href='${slide.link}' target='_blank'>Open</a></div></div>`;
        }
        for(let i = 0; i < this.slides.length; i++) {
           
        }
        document.getElementById("slider").innerHTML = sliderHTML;
        document.querySelector(".slider-indexes").innerHTML = sliderIndexesHTML;
        document.getElementById("slide-" + this.current).style.left = 0;
    },
    prevSlide: function () {
        let next;
        if (this.current === 0) {
            next = this.slides.length - 1;
        } else {
            next = this.current - 1;
        }

        document.getElementById("slide-" + next).style.left = "-100%";
        document.getElementById("slide-" + this.current).style.left = 0;

        document.getElementById("slide-" + next).setAttribute("class", "singleSlide slideInLeft");
        document.getElementById("slide-" + this.current).setAttribute("class", "singleSlide slideOutRight");

        this.current = next;
    },
    nextSlide: function () {
        let next;
        if (this.current === (this.slides.length - 1)) {
            next = 0;
        } else {
            next = this.current + 1;
        }

        document.getElementById("slide-" + next).style.left = "100%";
        document.getElementById("slide-" + this.current).style.left = 0;

        document.getElementById("slide-" + next).setAttribute("class", "singleSlide slideInRight");
        document.getElementById("slide-" + this.current).setAttribute("class", "singleSlide slideOutLeft");

        this.current = next;
    }
}

const nextBtn = document.querySelector(".nextBtn");
const prevBtn = document.querySelector(".prevBtn");

nextBtn.addEventListener("click", () => {
    Slider.nextSlide();
});
prevBtn.addEventListener("click", () => {
    Slider.prevSlide();
});

const hideBtn = document.querySelector('.hideBtn');
const showBtn = document.querySelector('.showBtn');
const slider = document.getElementById("slider");

hideBtn.addEventListener('click', () => {
    slider.classList.add('hide');
});

showBtn.addEventListener('click', () => {
    slider.classList.remove('hide');
});

const toggle = document.querySelector(".slideshow");

toggle.addEventListener('click', (event)=>{
    if (event.target.classList.contains('start')){
        event.target.innerHTML = 'Stoped';
        clearInterval(interval)
    } else {
        event.target.innerHTML = 'In progress';
        interval = setInterval(()=>{
            Slider.nextSlide();
        },1000)
    }
    event.target.classList.toggle('start')
 })
 function moveTo (index) {
    Slider.current = index;
}
