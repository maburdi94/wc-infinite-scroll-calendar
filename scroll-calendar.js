
class ScrollCalendar extends HTMLElement {

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

    static renderElement(date) {
        const container = document.createElement('div');
        container.classList.add('month');


        const label = document.createElement('h2');
        label.classList.add('label');

        label.innerText = date.toLocaleString('en-us', { month: 'long', year: 'numeric' });


        const header = document.createElement('header');
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


        let dates = document.createElement('div');
        dates.classList.add('dates');

        dates.style.display = 'grid';
        dates.style.gridTemplateColumns = 'repeat(7, 1fr)';
        dates.style.gridAutoRows = '1fr';


        const today = new Date(),
            year = date.getFullYear(),
            month = date.getMonth();

        const NUM_DAYS = new Date(year, month + 1, 0).getDate();

        for(let i = 1; i <= NUM_DAYS; i++) {

            let date = document.createElement('div');
            date.classList.add('date');

            date.innerText = i;

            if ((i === today.getDate())
                && (month === today.getMonth())
                && (year === today.getFullYear())) {
                date.classList.add('today');
            }

            if (i === 1) {
                date.style.gridColumnStart = new Date(year, month, 1).getDay() + 1;
            }

            dates.appendChild(date);
        }

        container.dataset.date = date.toISOString();

        container.appendChild(label);
        container.appendChild(header);
        container.appendChild(dates);

        return container;
    }

    update(target) {
        let date = new Date(target.dataset.date);

        const SCROLL_UP = target === this.firstElementChild;
        for (let i = 0; i < 5; i++) {

            if (SCROLL_UP) {
                date.setMonth(date.getMonth() - 1);

                this.removeChild(this.lastChild);
                this.insertBefore(ScrollCalendar.renderElement(date), this.firstChild);

            } else { // SCROLL_DOWN
                date.setMonth(date.getMonth() + 1);

                this.removeChild(this.firstChild);
                this.appendChild(ScrollCalendar.renderElement(date));
            }
        }

    }

    constructor() {
        super();

        let date = new Date();

        date.setUTCHours(0,0,0,0);
        date.setMonth(date.getMonth() - 5);

        for (let i = 0; i < 11; i++) {
            this.appendChild(ScrollCalendar.renderElement(date));
            date.setMonth(date.getMonth() + 1);
        }

        this.children[5].scrollIntoView();
    }

}
customElements.define('scroll-calendar', ScrollCalendar);
