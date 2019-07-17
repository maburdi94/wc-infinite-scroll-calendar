

class DateScheduler extends HTMLElement {

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

        date.setMonth(date.getMonth() - 5);
        for (let i = 0; i < 11; i++) {
            this.appendChild(DateScheduler.renderElement(date));
            date.setMonth(date.getMonth() + 1);
        }

        this.children[5].scrollIntoView();
    }


    static renderElement(date) {

        const TODAY = new Date();

        let year = date.getFullYear();
        let month = date.getMonth();


        date.setUTCHours(0,0,0,0);

        let container = document.createElement('div');
        container.classList.add('month');


        let monthLabel = document.createElement('h2');
        monthLabel.classList.add('label');
        monthLabel.innerText = date.toLocaleString('en-us', { month: 'long', year: 'numeric' });


        let header = document.createElement('header');
        header.classList.add('weekdays');

        header.style.display = 'grid';
        header.style.gridTemplateColumns = 'repeat(7, 1fr)';
        header.innerHTML = `
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
        `;


        let grid = document.createElement('div');
        grid.classList.add('dates');

        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gridAutoRows = '1fr';


        const NUM_DAYS_IN_MONTH = new Date(year, month + 1, 0).getDate();
        for(let i = 1; i <= NUM_DAYS_IN_MONTH; i++) {

            let date = new Date(year, month, i);

            let cell = document.createElement('div');
            cell.classList.add('date');

            cell.innerText = i;



            if ((i === TODAY.getDate())
                && ((date.getMonth() === TODAY.getMonth())
                && (date.getFullYear() === TODAY.getFullYear()))) {
                cell.classList.add('today');
            }

            if (this.#date
                && (i === this.#date.getDate())
                && ((date.getMonth() === this.#date.getMonth())
                    && (date.getFullYear() === this.#date.getFullYear()))) {
                cell.classList.add('active');
            }

            if (i === 1) {
                cell.style.gridColumnStart = date.getDay() + 1;
            }

            grid.appendChild(cell);
        }

        container.dataset.date = date.toISOString();

        container.appendChild(monthLabel);
        container.appendChild(header);
        container.appendChild(grid);


        return container;
    }

    update(target) {

        let date = new Date(target.dataset.date);

        const SCROLL_UP = target === this.firstElementChild;
        for (let i = 0; i < 5; i++) {

            if (SCROLL_UP) {
                date.setMonth(date.getMonth() - 1);

                this.removeChild(this.lastChild);
                this.insertBefore(DateScheduler.renderElement(date), this.firstChild);

            } else { // SCROLL_DOWN
                date.setMonth(date.getMonth() + 1);

                this.removeChild(this.firstChild);
                this.appendChild(DateScheduler.renderElement(date));
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
customElements.define('x-schedule-date', DateScheduler);
