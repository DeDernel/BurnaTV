export class Tab{
    constructor(container , ...name){
        this.tabName = name;
        this.tabContainer = document.querySelector(container);

        if(!this.tabContainer || !this.tabName.length) return;
        
        this.config = {
            'Star Gaze' : {value: 'dash.html'},
            'Popular Actors & Actresses' : {value: 'dash.html'},
            'Browse & Discovery' : {value: 'browse.html'}
        }
        this.render();
    }
    render(){
        this.tabName.forEach(tab => {
            const box = document.createElement('a');
            box.href = this.config[tab]?.value || 'browse.html';

            box.className = ` flex items-center gap-2 flex-shrink-0
            rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs text-white/90 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/15
            `;
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-angle-right';


            const li = document.createElement('li');
            li.textContent = tab;

            box.append(li , icon);
            this.tabContainer.appendChild(box);
        })
    }
}