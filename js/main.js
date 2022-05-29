let urls = {meilleurFilm:"http://localhost:8000/api/v1/titles/?sort_by=-votes%2C-imdb_score",
            filmMieuxNotes:"http://localhost:8000/api/v1/titles/?sort_by=-votes%2C-imdb_score",
            adventure:"http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-votes%2C-imdb_score",
            fantasy:"http://localhost:8000/api/v1/titles/?genre=Fantasy&sort_by=-votes%2C-imdb_score",
            thriller:"http://localhost:8000/api/v1/titles/?genre=Thriller&sort_by=-votes%2C-imdb_score",
            titre:"http://127.0.0.1:8000/api/v1/titles/"}

let data = [];


const fetchUrl = async function(url){
    let reponse = await fetch(url)
    return await reponse.json()
}

function creerDiv (nomClasse){
    let div = document.createElement('div')
    div.setAttribute('class', nomClasse)
    return div
}

    const enregistrerPromesse = async function(url) {
        let promesse = await fetchUrl(url)
        data = [];
        promesse.results.forEach(film => {
            data.push(film)
        })
    }

window.onload = async function () {
    await enregistrerPromesse(urls.meilleurFilm)
    await creerElementMeilleurFilm('meilleurFilm')
    await enregistrerPromesse(urls.filmMieuxNotes)
    await creerElementDom('carousel1')
    await creerCarousel('#carousel1',1,7)
    await enregistrerPromesse(urls.thriller)
    await creerElementDom('carousel2')
    await creerCarousel('#carousel2',1,7)
    await enregistrerPromesse(urls.adventure)
    await creerElementDom('carousel3')
    await creerCarousel('#carousel3',1,7)
    await enregistrerPromesse(urls.fantasy)
    await creerElementDom('carousel4')
    await creerCarousel('#carousel4',1,7)
}

const creerElementDom = async function(nomBaliseHtml) {
    for (film of data) {
        let item = creerDiv('item')
        let itemImage = creerDiv('item__image')
        let image = document.createElement('img')
        image.src = film.image_url;
        let itemBody = creerDiv('item__body')
        let itemTitle = creerDiv('item__title')
        itemTitle.innerHTML = film.title;
        document.getElementById(nomBaliseHtml).appendChild(item)
        item.appendChild(itemImage)
        itemImage.appendChild(image)
        item.appendChild(itemBody)
        itemBody.appendChild(itemTitle)
        creerModal(image,film.id)
    }
}

const creerElementMeilleurFilm = async function(nomBaliseHtml) {
        let meilleurFilmItem = creerDiv('meilleurFilm__item')
        let meilleurFilmItemImage = creerDiv('meilleurFilm__itemImage')
        let meilleurFilmImage = document.createElement('img')
        meilleurFilmImage.src = data[0].image_url;
        let meilleurFilmItemBody = creerDiv('meilleurFilm__itemBody')
        let meilleurFilmTitle = creerDiv('meilleurFilm__title')
        let meilleurFilmDescription = creerDiv('meilleurFilm__description')
        let meilleurFilmButton = creerDiv('meilleurFilm__button')
        let meilleurFilmButtonRed = document.createElement('button')
        meilleurFilmButtonRed.setAttribute('class','meilleurFilm__button--red')
        let meilleurFilmButtonGreen = document.createElement('button')
        meilleurFilmButtonGreen.setAttribute('class','meilleurFilm__button--green')
        meilleurFilmButtonGreen.innerHTML="<b>P</b>lus D'infos"
        meilleurFilmButtonRed.innerHTML="<b>L</b>ancer Vidéo"
        document.getElementById(nomBaliseHtml).appendChild(meilleurFilmItem)
        meilleurFilmItem.appendChild(meilleurFilmItemImage)
        meilleurFilmItemImage.appendChild(meilleurFilmImage)
        meilleurFilmItem.appendChild(meilleurFilmItemBody)
        meilleurFilmItemBody.appendChild(meilleurFilmTitle)
        meilleurFilmItemBody.appendChild(meilleurFilmDescription)
        meilleurFilmItemBody.appendChild(meilleurFilmButton)
        meilleurFilmButton.appendChild(meilleurFilmButtonGreen)
        meilleurFilmButton.appendChild(meilleurFilmButtonRed)
        const informations = await fetchUrl(urls.titre + data[0].id)
        meilleurFilmTitle.innerHTML = informations.original_title
        meilleurFilmDescription.innerHTML= informations.description
        creerModal(meilleurFilmButtonGreen,data[0].id)

}


const creerModal = async function (image,film) {
    const informations = await fetchUrl(urls.titre + film)
    const modal = document.getElementById('modal')
    const modalImage= document.getElementById('modal__image')
    const modalImg = document.createElement('img')
    modalImage.setAttribute('id','modal__image')
    const modalDescription = document.getElementById('modal__description')

    image.onclick = function() {
        modalImage.appendChild(modalImg)
        modalImg.src= informations.image_url
        modalDescription.innerHTML = (`<p><b>Titre:</b> ${informations.original_title}` + "<br>" +
                                        `<b>Genre:</b> ${informations.genres}` + "<br>" +
                                        `<b>Date de sortie:</b> ${informations.year}` + "<br>" +
                                        `<b>Imdb Score:</b> ${informations.imdb_score}` + "<br>" +
                                        `<b>Réalisateur:</b> ${informations.directors}` + "<br>" +
                                        `<b>Acteurs:</b> ${informations.actors}` + "<br>" +
                                        `<b>Durée:</b> ${informations.duration} Minutes` + "<br>" +
                                        `<b>Pays d'origine:</b> ${informations.countries}` + "<br>" +
                                        `<b>Résultat box office:</b> ${informations.worldwide_gross_income}$` + "<br>" +
                                        `<b>Résumé du film:</b> ${informations.description}</p>`)
        modal.style.display = "flex";
    }
    modal.onclick = function () {
       modalImage.innerHTML= " "
        modalDescription.innerHTML= " "
        modal.style.display = "none"
    }
}


/**
 * @param {string} nomClasse
 * @returns {HTMLElement}
 */

class Carousel{
    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} options.slidesToScroll Nombre d'éléments à faire défiler
     * @param {Object} options.slidesVisible Nombre d'éléments visible dans un carousel
     */
    constructor(element,options={}) {
        this.element = element
        this.options = Object.assign({},{
            slidesToScroll:1,
            slidesVisible:1,
        },options)
        let children = [].slice.call(element.children)
        this.currentItem = 0
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
    }
    /**
     * Donne les bonnes dimensions aux éléments du carousel
     */
    setStyle () {
        let ratio = this.items.length / this.options.slidesVisible
        this.container.style.width = (ratio*100) + "%"
        this.items.forEach(item => item.style.width = ((100/ this.options.slidesVisible)/ratio)+ "%")
    }
    createNavigation(){
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click',this.next.bind(this))
        prevButton.addEventListener('click',this.prev.bind(this))
    }
    next () {
        this.goToItem(this.currentItem+this.options.slidesToScroll)

    }
    prev (){
        this.goToItem(this.currentItem-this.options.slidesToScroll)

    }
    /**
     * Deplace le carousel vers l'élément
     * @param index
     */
    goToItem(index){
        if (index >= 1) {
            !this.next()

        }else if (index === (-this.items.length+this.options.slidesVisible-1)){
            console.log('test')
            !this.prev()
        }
        let translateX = index * 100 / this.items.length
        this.container.style.transform = 'translate3d('+translateX+'%,0,0)'
        this.currentItem = index
    }
    /**
     *
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass (className){
        let div = document.createElement('div')
        div.setAttribute('class',className)
        return div
    }
}

function creerCarousel(nomCarousel,slideScroll,slideVisible){
     new Carousel(document.querySelector(nomCarousel), {
        slidesToScroll: slideScroll,
        slidesVisible: slideVisible
    })
}
