(function() {
NodeList.prototype.map = function(callback) {
    const result = [];
    this.forEach((el,i,array) => {
        const returned = callback(el,i,array);
        (returned) ? result.push(returned) : result.push(''); 
    });
    return result;
}

class Gallery {
    constructor(options) {
        this.groups = {};
        this.activeImage = {};
        this.components = options.components || {};
        this._variables = {};
    }

    getRoot() {
        //init container__galleryApp
        const container = document.createElement('div');
        container.className = 'container__galleryApp';
        const containerComponent = new ContainerApp(container);
        containerComponent.$el.innerHTML = containerComponent.addImageContainer();
        this.Elements[ContainerApp.shortName()] = containerComponent;
        
    
        this.initComponents();

        return containerComponent.$el;
    }

    initComponents() {
        this.components.forEach(Component => {
            const tag = Component.getTagName ?
                Component.getTagName():
                'div';
            const node = document.createElement(tag);
            node.className = Component.className();
            const component = new Component(node);
            component.$el.innerHTML = component.toHTML();
            //init inner components of the component if there are any
            (component.initInnerComponents) ?
                component.initInnerComponents():
                null
            this.Elements[Component.shortName()] = component;
            this.Elements[ContainerApp.shortName()].$el.appendChild(component.$el);
        });
    }

    build() {
        this.Elements = {};

        const wrapperApp = document.createElement('div');
        wrapperApp.className = BgClosing.className();
        this.$root = wrapperApp;
        const rootElement = new BgClosing(this.$root);
        
        this.Elements[BgClosing.shortName()] = rootElement;
        let a = this.Elements[BgClosing.shortName()];
        this.$root.appendChild(this.getRoot());

        let body = document.querySelector('body');
        body.appendChild(this.$root);
        
        delete this.components;
    }

    showApp(imgObject) {
        const quantityImages = this.groups[imgObject.selector].length;

        if (quantityImages <= 1) {
            this.setSinglePreset();
        } else {
            this.setFullPreset();
        }
        //initial image in gallery
        this.changeImage(imgObject);

        this.$root.classList.remove('hidden');
    }

    hiddeApp() {
        this.$root.classList.add('hidden');

        this.stopAutoSlider();
    }

    changeImage(imgObject) {
        const img = $('[data-imageOfApp=""]');
        this.activeImage = imgObject;
        img.src = imgObject.path;
        
        //*checking whether the user has deleted the upload button*
        this.Elements.downloadBtn.changeHref(imgObject);
        this.Elements.counter.refreshValue(
            imgObject.index + 1, this.groups[imgObject.selector].length)
    }

    smoothChangeImage(imgObject) {
        const img = $('[data-imageOfApp=""]');
        this.activeImage = imgObject;

        
        //*checking whether the user has deleted the upload button*
        this.Elements.downloadBtn.changeHref(imgObject);
        this.Elements.counter.refreshValue(
            imgObject.index + 1, this.groups[imgObject.selector].length)
    }

    setSinglePreset() {
        const elems = this.Elements;
        for (let element in elems) {
            if (elems.hasOwnProperty(element)) {
                if(elems[element].singlePreset) {
                    const nodeElement = elems[element].$el;
                    nodeElement.classList.add('hidden');
                }
            }  
        }
    }

    setFullPreset() {
        const elems = this.Elements;
        for (let element in elems) {
            if (elems.hasOwnProperty(element)) {
                const nodeElement = elems[element].$el;
                nodeElement.classList.remove('hidden');
            }  
        }
    }

    previousImage() {
        const indexImage = this.activeImage.index;
        let newIndex;
        (indexImage === 0) ?
            newIndex = this.groups[this.activeImage.selector].length - 1:
            newIndex = indexImage - 1;
        const newImage = this.groups[this.activeImage.selector][newIndex];
        this.changeImage(newImage);
        this.makeAutosliderCooldown();
    }

    nextImage() {
        const {newImage: newImage} = this.getDataImage();
        this.changeImage(newImage);
        this.makeAutosliderCooldown();
    }  
    
    smoothNextImage() {
        const {newImage: newImage} = this.getDataImage();
        const container = $('.img-container__galleryApp');
        const img = $('[data-imageOfApp=""]');

        if (!this.newSmoothImage) {
            this.newSmoothImage = newImage.$el.cloneNode();
            this.newSmoothImage.alt = '#';
            this.newSmoothImage.classList.add('next-img');
            container.appendChild(this.newSmoothImage);
        }
        this.newSmoothImage.src = newImage.path;

        if (!this.autosliderCooldown) {
            this.hideCurrentImg(img);
            this.showNextImg(this.newSmoothImage);
        }
    }

    hideCurrentImg(img) {
        setTimeout(() => {
            img.style.transition = 'all 1s linear';
            img.style.opacity = '0';
        }, 0);
        setTimeout(() => {
            const {newImage: newImage} = this.getDataImage();
            img.style.transition = 'all 0s linear';
            this.changeImage(newImage);
            img.style.opacity = '1';
        }, 1000);
    }

    showNextImg(newSmoothImage) {
        setTimeout(() => {
            newSmoothImage.style.transition = 'all 1s linear';
            newSmoothImage.style.opacity = '1';
        }, 0);
        setTimeout(() => {
            newSmoothImage.style.transition = 'all 0s linear';
            newSmoothImage.style.opacity = '0';
        }, 1000);
    }

    makeAutosliderCooldown() {
        this.autosliderCooldown = true;
        const indexTimeout = setTimeout(() => {
            this.autosliderCooldown = false;
        }, 700);

        if (!this.cooldownIndexes) {
            this.cooldownIndexes = [];
        }
        if (this.cooldownIndexes.length >= 1) {
            this.clearCooldownIndexes();
        }
        this.cooldownIndexes.push(indexTimeout);
    };

    clearCooldownIndexes() {
        this.cooldownIndexes.forEach(timeoutID => {
            clearTimeout(timeoutID);
            this.cooldownIndexes = [];
        });
    }

    getDataImage() {
        const indexCurrentImage = this.activeImage.index;
        let newIndex;
        
        const maxIndex = this.groups[this.activeImage.selector].length - 1;
        (indexCurrentImage === maxIndex) ?
            newIndex = 0:
            newIndex = indexCurrentImage + 1;
        const newImage = this.groups[this.activeImage.selector][newIndex];

        return {
            currentIndex: indexCurrentImage,
            maxIndex: maxIndex,
            newImage: newImage,
        };
    }

    stopAutoSlider() {
        let autosliderCheckbox = this.Elements.autoSlider.$checkbox;
        if (autosliderCheckbox.checked) {
            const event = new Event('change');
            autosliderCheckbox.checked = false;
            autosliderCheckbox.dispatchEvent(event);
        }
    }

    startTrackingMove() {
        const body = $('body');
        this._variables.trotlingShow = trotlingMove.bind(this, body, 1000);

        body.addEventListener('mousemove', this._variables.trotlingShow);

        this._variables.autoHideId = setTimeout(() => {
            this.hideElemsOnFullscreen();
        }, 1000);

        function trotlingMove(target, delay) {
            target.removeEventListener('mousemove', this._variables.trotlingShow);

            this._variables.hideAfterMoveId = setTimeout(() => {
                target.addEventListener('mousemove', this._variables.trotlingShow);
                this.hideElemsOnFullscreen();
            }, delay);
            this.showElemsOnFullscreen();
            clearTimeout(this._variables.autoHideId);
        }
    }

    stopTrackingMove() {
        const body = $('body');
        if (this._variables.trotlingShow) {
            body.removeEventListener('mousemove', this._variables.trotlingShow);
            this.showElemsOnFullscreen();
            delete this._variables.trotlingShow;

            if (this._variables.autoHideId) {
                clearTimeout(this._variables.autoHideId);
                delete this._variables.autoHideId;
            }

            if (this._variables.hideAfterMoveId) {
                clearTimeout(this._variables.hideAfterMoveId);
                delete this._variables.hideAfterMoveId;

            }
        }
    }

    hideElemsOnFullscreen() {
        const elements = this.Elements;
        elements.crossClosing.setOpacity(0, '1s');
        elements.downloadBtn.setOpacity(0, '1s');
        elements.fullScreenBtn.setOpacity(0, '1s');
        elements.slideNext.setOpacity(0, '1s');
        elements.slidePrev.setOpacity(0, '1s');
    }

    showElemsOnFullscreen() {
        const elements = this.Elements;
        elements.crossClosing.setOpacity('1', '1s');
        elements.downloadBtn.setOpacity('1', '1s');
        elements.fullScreenBtn.setOpacity('1', '1s');
        elements.slideNext.setOpacity('1', '1s');
        elements.slidePrev.setOpacity('1', '1s');
    }
}

class DOMListener {
    constructor(options) {
        this.listeners = options.listeners;
    }

    initDomListeners() {
        this.listeners.forEach((listener) => {
            const eventName = this.getEventName(listener);  
            
            this.$el.addEventListener(listener, this[eventName].bind(this))
        });
    }

    getEventName(shortName) {
        return 'on' +
            shortName[0].toUpperCase() +
            shortName.slice(1);
    }
}

class CloseApp extends DOMListener {
    constructor(options) {
        super(options);
        this.$el = options.el;
        this.initDomListeners(this.$el);
    }

    onClick() {
        event.stopPropagation();
        if (event.target === this.$el) {
            gallery.hiddeApp();
            toggleBodyScroll('unlock');
        }

        gallery.Elements.fullScreenBtn.disableFullScreen();
    }

}

class ContainerApp extends DOMListener {
    static shortName() {
        return 'containerApp';
    };
    constructor(el) {
        super({
            listeners: ['click'],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
    }

    onClick(e) {
        e.stopPropagation();
    }

    addImageContainer() {
        return `<div class="img-container__galleryApp">
            <img src="" alt="#" data-imageOfApp="">
            <div class="cover-image__galleryApp"></div>
        </div>`
    }
}

class SlideBtn extends DOMListener {
    constructor(options) {
        super(options);
        this.$el = options.el;
        this.initDomListeners(this.$el);
        this.singlePreset = true;
    }

    onClick() {
        event.stopPropagation();
        (this.direction === 'previous') ? 
            gallery.previousImage():
            gallery.nextImage();
    }
}

class Image extends DOMListener{
    constructor(img, index, parameters) {
        super({
            listeners: ['click'],
        });
        this.$el = img;
        this.path = img.src;
        this.index =  index;
        this.selector = parameters.selector;
    }

    onClick() {
        gallery.showApp(this);
        toggleBodyScroll();
    }
}

class BgClosing extends CloseApp {
    static shortName() {
        return 'bgClosing';
    };
    static className() {
        return 'galleryApp hidden';
    };
    constructor(el) {
        super({
            el,
            listeners: ['click'],
        });
    }

    toHTML() {
        return '';
    }
}

class CrossClosing extends CloseApp {
    static shortName() {
        return 'crossClosing';
    };
    static className() {
        return 'close__galleryApp';
    };
    constructor(el) {
        super({
            el,
            listeners: ['click'],
        });
    }
    toHTML() {
        return '';
    }
    setOpacity(value, duration) {
        this.$el.style.transition = `all ${duration} ease`;
        this.$el.style.opacity = value + '';
        return this;
    }
}

class SlideNext extends SlideBtn {
    static shortName() {
        return 'slideNext';
    };
    static className() {
        return 'btn-wrapper next';
    };
    constructor(el) {
        super({
            el,
            listeners: ['click'],
        });
    }
    toHTML() {
        return '<div class="btn-next__btn-wrapper"></div>';
    }
    onClick() {
        event.stopPropagation();
        gallery.nextImage();
    }
    setOpacity(value, duration) {
        this.$el.style.transition = `all ${duration} ease`;
        this.$el.style.opacity = value + '';
        return this;
    }
}

class SlidePrev extends SlideBtn {
    static shortName() {
        return 'slidePrev';
    };
    static className() {
        return 'btn-wrapper previous';
    };
    constructor(el) {
        super({
            el,
            listeners: ['click'],
        });
    }
    toHTML() {
        return '<div class="btn-prev__btn-wrapper"></div>';
    }
    onClick() {
        event.stopPropagation();
        gallery.previousImage();
    }
    setOpacity(value, duration) {
        this.$el.style.transition = `all ${duration} ease`;
        this.$el.style.opacity = value + '';
        return this;
    }
}

class DownloadBtn extends DOMListener {
    static getTagName() {
        return 'a';
    };
    static shortName() {
        return 'downloadBtn';
    };
    static className() {
        return 'btn-download__galleryApp'
    }
    constructor(el) {
        super({
            listeners: [],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
        this.$el.download = '';
    }
    changeHref(imgObject) {
        this.$el.href = imgObject.path;
    }
    toHTML() {
        return '<span class="vertical-stick"></span>';
    }
    setOpacity(value, duration) {
        this.$el.style.transition = `all ${duration} ease`;
        this.$el.style.opacity = value + '';
        return this;
    }
}

class FullScreenBtn extends DOMListener {
    static shortName() {
        return 'fullScreenBtn';
    };
    static className() {
        return 'btn-fullScreen__galleryApp';
    };

    constructor(el) {
        super({
            listeners: ['click'],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
        this.status = false;
        this.initButtonSlider();
    }

    onClick() {
        event.stopPropagation();
        
        !(this.status) ?
            this.activeFullScreen():
            this.disableFullScreen();
    }

    activeFullScreen() {
        this.classesContainer.add('fullScreen');
        this.status = true;
        window.addEventListener('keydown', this.closeByEsc);
        this.showAutoslider();
        gallery.startTrackingMove();
    }

    closeByEsc(e) {
        const context = gallery.Elements.fullScreenBtn;
        if (e.code === 'Escape') {
            window.removeEventListener('keydown', context.closeByEsc);
            context.disableFullScreen();
        }
    }

    disableFullScreen() {
        this.classesContainer.remove('fullScreen');
        this.status = false;
        this.hideAutoslider();
        gallery.stopTrackingMove();
    }

    toHTML() {
        this.initClassesContainer();
        return '<span class="corner"></span>';
    }

    initClassesContainer() {
        this.classesContainer = gallery.Elements.containerApp.$el.classList;
    }

    initButtonSlider() {
        window.addEventListener('keydown', function(e) {
            const isActive = !(gallery.$root.classList.contains('hidden'));
            if (isActive) {
                if (e.code === 'ArrowRight') {
                    event.preventDefault();
                    gallery.nextImage();
                }
                if (e.code === 'ArrowLeft') {
                    gallery.previousImage();
                }
            }
        })
    }

    showAutoslider() {
        const autoslider = gallery.Elements.autoSlider.$el;
        autoslider.classList.remove('hide');
    }

    hideAutoslider() {
        const autoslider = gallery.Elements.autoSlider.$el;
        autoslider.classList.add('hide');
        gallery.stopAutoSlider();
    }

    setOpacity(value, duration) {
        this.$el.style.transition = `all ${duration} ease`;
        this.$el.style.opacity = value + '';
        return this;
    }
}

class Counter extends DOMListener {
    static shortName() {
        return 'counter';
    };
    static className() {
        return 'counter__galleryApp';
    };
    constructor(el) {
        super({
            listeners: ['click', 'keydown', 'wheel'],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
    }

    onClick() {
        event.stopPropagation();
    }

    onWheel(event) {
        if (event.deltaY < 0) {
            gallery.nextImage();
        } else {
            gallery.previousImage();
        }
    }

    onBlur() {
        this.openImage(this.$currentField.innerHTML);
    }

    onKeydown() {
        const controlButtons = [8, 37, 39, 46];
        const isNumner = (event.keyCode >= 48 && event.keyCode <= 57);
        const isControl = controlButtons.indexOf(event.keyCode) != -1;
        if (!isNumner && !isControl) {
            event.preventDefault();
        }

        if (event.key === 'Enter') {
            const findValue = +(this.$currentField.innerHTML);
            this.openImage(findValue);
        }
    }

    openImage(findValue) {
        const value = this.checkValidValue(findValue);
        const activeSelector = gallery.activeImage.selector;
        const imgObject = gallery.groups[activeSelector][value - 1];
        
        gallery.changeImage(imgObject);
    }

    checkValidValue(findValue) {
        if (findValue > this.maxValue) {
            return this.maxValue;
        } else if (findValue < 0) {
            return 0;
        } else {
            return findValue;
        }
    }

    toHTML() {
        return `<span class="current" contenteditable></span>
        <span>&bull;</span>
        <span class="max-value"></span>`
    }

    refreshValue(value, max) {
        if (!this.$currentField) {
            this.$currentField = $('.counter__galleryApp .current');
        }
        this.currentValue = value;
        this.$currentField.innerHTML = value;

        if (!this.$maxValueField || this.maxValue != max) {
            this.$maxValueField = $('.counter__galleryApp .max-value');
            this.maxValue = max;
            this.$maxValueField.innerHTML = max;
        }

        this.initOnBlur();
    }

    initOnBlur() {
        if ( !(this.$currentField.listeners) ) {
            this.$currentField.addEventListener('blur', this.onBlur.bind(this));
        }
        
    }
}

class Autoslider extends DOMListener {
    static getTagName() {
        return 'form';
    };
    static shortName() {
        return 'autoSlider';
    };
    static className() {
        return 'autoSlider-wrapper hide';
    };

    constructor(el) {
        super({
            listeners: ['click'],
        });
        this.$el = el;
        this.singlePreset = true;
        this.initDomListeners(this.$el);
    }

    onClick() {
        event.stopPropagation();
    }

    changedCheckbox() {
        if (this.$checkbox.checked) {
            clearInterval(this.indexTimeout);
            this.indexTimeout = setInterval(gallery.smoothNextImage.bind(gallery), this.timeout);
        } else {
            clearInterval(this.indexTimeout);
        }
    }

    changedRange() {
        this.timeout = this.getTimeout();
        this.showAndHideIndicator();
        this.setStyleRange();
        this.changedCheckbox();

        this.recalIndicator();
    }

    setStyleRange() {
        const range = this.$range;
        const divisionValue = +(range.clientWidth) / +(range.max);
        const widthLine = divisionValue * +(range.value);
        const bgStyle = `linear-gradient(to right,
                                        #ffffff ${widthLine}%,
                                        #676767 ${widthLine}%)`;
        range.style.background = bgStyle;
    }

    initRange() {
        let bgStyle = 'linear-gradient(to right, #ffffff 7%, #676767 7%)';
        this.$range = this.$el.elements.sliderRange;
        this.$range.style.background = bgStyle;
        this.$range.addEventListener('change', this.changedRange.bind(this));
        this.$range.addEventListener('input', this.changedRange.bind(this));
        this.timeout = this.getTimeout();
    }

    initCheckbox() {
        this.$checkbox = this.$el.elements.autoslider;
        this.$checkbox.addEventListener('change', this.changedCheckbox.bind(this));
        this.indexTimeout = null;
    }

    initIndicator() {
        this.$indicator = this.$el.children[2].children[1];

    }

    showAndHideIndicator(delay = 600) {
        this.$indicator.style.opacity = 1;
        clearTimeout(this.showHideIndicatorId);
        this.showHideIndicatorId = setTimeout(() => {
            this.$indicator.style.opacity = 0;
            this.$indicator.style.opacity = '';
        }, delay);
    }

    recalIndicator() {
        const value = +(this.$range.value);
        let word;
        switch(value) {
            case 1:
                word = ' секунда';
                break;
            case 2:
            case 3:
            case 4:
                word = ' секунды';
                break;
            default:
                word = ' секунд';
        }
        this.$indicator.innerText = value + word;
    }

    initInnerComponents() {
        this.initIndicator();
        this.initCheckbox();
        this.initRange();
    }

    toHTML() {
        return `<input type="checkbox" id="autoslider">
        <label class="checkmark" for="autoslider">Показ слайдов</label>
        <div class="wrapper-range">
          <input type="range" id="sliderRange" min="1" max="15" step="1" value="1">
          <span class="time-indicator">1 секунда</span>
        </div>`
    }

    getTimeout() {
        return +(this.$range.value) * 1000 + 1000;
    }

    stopAutoSlider() {
        let a = this.$checkbox
        debugger
    }
}

function initGallery(imgObject) {
    gallery.build(imgObject);
}

function addGroup(parameters) {
    let imagesNode = $all(parameters.selector);
    
    images = getInstanceImage(imagesNode, parameters);
    images.forEach(img => img.initDomListeners(img.img)
    );
    
    gallery.groups[parameters.selector] = images;
}

function getInstanceImage(images, parameters) {
    return images.map((elem, index) => {
        return new Image(elem, index, parameters);
    });
}

function toggleBodyScroll(type) {
    const body = $('body');
    (type === 'unlock')?
    body.classList.remove('lock') :
    body.classList.add('lock');
}

function $(selector) {
    return document.querySelector(selector);
}
function $all(selector) {
    return document.querySelectorAll(selector);
}

const gallery = new Gallery({
    components: [
        CrossClosing,
        SlideNext,
        SlidePrev,
        DownloadBtn,
        FullScreenBtn,
        Counter,
        Autoslider],
});


window.addEventListener('load', initGallery);

console.log(gallery);

/////////////////
addGroup({
    selector: '[data-gallery]'
});

addGroup({
    selector: '[data-gallery-two]'
});

})();
