class BorderAnimation {
    constructor(element) {
        this.element = element;
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.animationFrame = null;
        this.currentOffset = null;
        this.observer = new ResizeObserver(() => this.updatePath());

        this.init();
    }

    init() {
        this.svg.appendChild(this.path);
        this.element.appendChild(this.svg);

        this.updatePath();
        this.observer.observe(this.element);

        this.element.addEventListener('mouseenter', () => this.animate('draw'));
        this.element.addEventListener('mouseleave', () => this.animate('erase'));
    }

    getBorderRadius() {
        const style = getComputedStyle(this.element);
        const borderRadius = style.borderRadius;
        if (borderRadius.includes(' ')) {
            return parseFloat(borderRadius.split(' ')[0]);
        }
        return parseFloat(borderRadius);
    }

    updatePath() {
        const rect = this.element.getBoundingClientRect();
        const radius = this.getBorderRadius();
        const width = rect.width;
        const height = rect.height;
        const strokeWidth = 2;

        const adjustedWidth = width - strokeWidth;
        const adjustedHeight = height - strokeWidth;
        const adjustedRadius = Math.max(radius - strokeWidth / 2, 0);

        const path = `
            M ${adjustedRadius + strokeWidth / 2},${strokeWidth / 2}
            H ${adjustedWidth - adjustedRadius}
            A ${adjustedRadius},${adjustedRadius} 0 0 1 ${adjustedWidth},${adjustedRadius + strokeWidth / 2}
            V ${adjustedHeight - adjustedRadius}
            A ${adjustedRadius},${adjustedRadius} 0 0 1 ${adjustedWidth - adjustedRadius},${adjustedHeight}
            H ${adjustedRadius + strokeWidth / 2}
            A ${adjustedRadius},${adjustedRadius} 0 0 1 ${strokeWidth / 2},${adjustedHeight - adjustedRadius}
            V ${adjustedRadius + strokeWidth / 2}
            A ${adjustedRadius},${adjustedRadius} 0 0 1 ${adjustedRadius + strokeWidth / 2},${strokeWidth / 2}
        `;

        this.path.setAttribute("d", path);

        this.length = this.path.getTotalLength();
        this.path.style.strokeDasharray = this.length;
        this.currentOffset = this.length;
        this.path.style.strokeDashoffset = this.currentOffset;
    }

    animate(direction) {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const startOffset = this.currentOffset;
        const endOffset = direction === 'draw' ? 0 : this.length;
        const duration = 1000;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.ease(progress);
            this.currentOffset = startOffset + (endOffset - startOffset) * easeProgress;
            
            this.path.style.strokeDashoffset = this.currentOffset;

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(step);
            } else {
                this.animationFrame = null;
            }
        };

        this.animationFrame = requestAnimationFrame(step);
    }

    ease(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
}

setTimeout(() => {
    document.querySelectorAll('.animated-border').forEach(element => {
        new BorderAnimation(element);
    });
}, 1000);