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

    setSinglePreset() {
        const elems = this.Elements;
        for (let element in elems) {
            if (elems.hasOwnProperty(element)) {
                if(elems[element].singlePreset) {
                    const nodeElement = elems[element].$el;
                    nodeElement.classList.add('hidden')
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
    }

    nextImage() {
        const indexImage = this.activeImage.index;
        let newIndex;
        
        const maxIndex = this.groups[this.activeImage.selector].length - 1;
        (indexImage === maxIndex) ?
            newIndex = 0:
            newIndex = indexImage + 1;
        const newImage = this.groups[this.activeImage.selector][newIndex];
        this.changeImage(newImage);
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

        //disable FullScreen after closing app
        gallery.Elements.fullScreenBtn.disableFullScreen();
    }

}

class ContainerApp {
    static shortName() {
        return 'containerApp';
    };
    constructor(el) {
        this.$el = el;
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
            el,
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
            el,
            listeners: ['click'],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
        this.status = false;
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
    }

    disableFullScreen() {
        this.classesContainer.remove('fullScreen');
        this.status = false;
    }

    toHTML() {
        this.initClassesContainer();
        return '<span class="corner"></span>';
    }

    initClassesContainer() {
        this.classesContainer = gallery.Elements.containerApp.$el.classList;
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
            el,
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
        return 'autoSlider-wrapper';
    };

    constructor(el) {
        super({
            el,
            listeners: [],
        });
        this.$el = el;
        this.initDomListeners(this.$el);
    }

    changedCheckbox() {
        if (this.$checkbox.checked) {
            console.log(2132132);
            clearInterval(this.indexTimeout);
            this.indexTimeout = setInterval(gallery.nextImage.bind(gallery), this.timeout);
        } else {
            console.log(888);
            clearInterval(this.indexTimeout);
        }
    }

    changedRange() {
        this.timeout = this.getTimeout();
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
        return +(this.$range.value) * 1000;
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
