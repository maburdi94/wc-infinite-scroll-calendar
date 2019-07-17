

class TimeScheduler extends HTMLElement {

    connectedCallback() {

        let observer = new IntersectionObserver((entries) => {
            let el = entries[0];

            if (el.isIntersecting) {
                observer.unobserve(this.firstElementChild);
                observer.unobserve(this.lastElementChild);

                this.update(el.target);

                observer.observe(this.firstElementChild);
                observer.observe(this.lastElementChild);
            }

        });

        observer.observe(this.firstElementChild);
        observer.observe(this.lastElementChild);
    }

    render() {
        let date = this.getAttribute('date');
        date = date ? new Date(date) : new Date();

        this.innerHTML = '';

        date.setDate(date.getDate() - 3);
        for (let i = 0; i < 7; i++) {
            this.appendChild(this.renderElement(date));
            date.setDate(date.getDate() + 1);
        }

        this.children[3].scrollIntoView();
    }


    renderElement(date) {

        const TODAY = new Date();

        let container = document.createElement('div');
        container.classList.add('day');


        if ((date.getDate() === TODAY.getDate())
            && ((date.getMonth() === TODAY.getMonth())
                && (date.getFullYear() === TODAY.getFullYear()))) {
            container.classList.add('today');
        }

        let dayLabel = document.createElement('h2');
        dayLabel.classList.add('label');

        dayLabel.innerText = date.toLocaleString('en-us', { month: 'long', day: 'numeric' });


        let grid = document.createElement('div');
        grid.classList.add('hours');

        grid.style.display = 'grid';
        grid.style.gridTemplateRows = 'repeat(24, 1fr)';


        let d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        for(let i = 0; i < 24; i++) {

            let cell = document.createElement('div');
            cell.classList.add('hour');

            cell.style.borderTop = '1px solid lightgray';

            cell.innerText = ("0" + (i % 12 + 1)).slice(-2) + ":00"; // 2-digit prepend with zero

            d.setUTCHours(i);
            cell.dataset.time = d.toISOString();

            grid.appendChild(cell);
        }


        container.dataset.date = date.toISOString();

        container.appendChild(dayLabel);
        container.appendChild(grid);

        return container;
    }

    update(target) {

        let date = new Date(target.dataset.date);

        const SCROLL_UP = target === this.firstElementChild;

        for (let i = 0; i < 3; i++) {

            if (SCROLL_UP) {
                date.setDate(date.getDate() - 1);

                this.removeChild(this.lastChild);
                this.insertBefore(this.renderElement(date), this.firstChild);

            } else { // SCROLL_DOWN
                date.setDate(date.getDate() + 1);

                this.removeChild(this.firstChild);
                this.appendChild(this.renderElement(date));
            }
        }

    }


    constructor() {
        super();

        this.style.display = 'block';
        this.style.overflowY = 'scroll';

        this.render();
    }

}
customElements.define('x-schedule-time', TimeScheduler);
