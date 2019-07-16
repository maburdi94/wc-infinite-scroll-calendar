

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
        let attr = this.getAttribute('date');
        let date = attr ? new Date(attr) : new Date();

        this.innerHTML = '';

        date.setMonth(date.getMonth() - 5);
        for (let i = 0; i < 11; i++) {
            this.appendChild(this.renderElement(date));
            date.setMonth(date.getMonth() + 1);
        }

        this.children[5].scrollIntoView();
    }


    renderElement(date) {

        const TODAY = new Date();

        let year = date.getFullYear();
        let month = date.getMonth();

        let container = document.createElement('div');
        container.classList.add('month');

        let monthLabel = document.createElement('h2');
        monthLabel.innerText = new Date(year, month).toLocaleString('en-us', { month: 'long', year: 'numeric' });

        let header = document.createElement('header');
        header.style.display = 'grid';
        header.style.gridTemplateColumns = 'repeat(7, 1fr)';
        header.style.justifyItems = 'center';
        header.style.padding = '1em 0 .5em';
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
        grid.style.padding = '.1em';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gridAutoRows = '1fr';
        grid.style.textAlign = 'center';


        const NUM_DAYS_IN_MONTH = new Date(year, month + 1, 0).getDate();
        for(let i = 1; i <= NUM_DAYS_IN_MONTH; i++) {

            let date = new Date(year, month, i);

            let cell = document.createElement('div');
            cell.style.borderTop = '1px solid lightgray';
            cell.style.cursor = 'pointer';
            cell.style.padding = '25% 0';

            cell.classList.add('date');
            cell.innerText = date.getDate();


            if ((date && TODAY)
                && (date.getDate() === TODAY.getDate())
                && ((date.getMonth() === TODAY.getMonth())
                && (date.getFullYear() === TODAY.getFullYear()))) {
                cell.style.color = 'red';
                cell.classList.add('today');
            }

            if (date.getDate() === 1) {
                cell.style.gridColumnStart = new Date(year, month, 1).getDay() + 1;
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
                this.removeChild(this.lastChild);

                date.setMonth(date.getMonth() - 1);

                this.insertBefore(this.renderElement(date), this.firstChild);

            } else { // SCROLL_DOWN
                this.removeChild(this.firstChild);

                date.setMonth(date.getMonth() + 1);

                this.appendChild(this.renderElement(date));
            }
        }
    }

    constructor() {
        super();

        this.style.display = 'block';
        this.style.fontSize = 'inherit';
        this.style.overflowY = 'auto';
        this.style.scrollSnapType = 'y mandatory';
        this.style.height = '400px';

        this.render();
    }

}
customElements.define('x-schedule-date', DateScheduler);
