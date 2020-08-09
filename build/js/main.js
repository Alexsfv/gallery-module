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
            const div = document.createElement('div');
            div.className = Component.className();
            const component = new Component(div);
            component.$el.innerHTML = component.toHTML();
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
            el: el,
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
            el: el,
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
            el: el,
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
            el: el,
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
    components: [CrossClosing, SlideNext, SlidePrev],
});


window.addEventListener('load', initGallery);

console.log(gallery);


addGroup({
    selector: '[data-gallery]'
});

addGroup({
    selector: '[data-gallery-two]'
});

})();
