import { GithubUser } from "./GithubUser.js"


// classe que vai conter a lógica dos dados 
// como os dados serão estruturados 

export class Favorites {
    constructor(root) {
        this.root =document.querySelector(root)
        this.load()
    }

    load() {
        this.entries =  JSON.parse(localStorage.getItem("@github-favorites:")) || []
    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
    }
 
    async add(username) {
        try{

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error("Usuário ja cadastrado")
            } 
            const user = await GithubUser.search(username)
            
            if(user.login === undefined) {
                throw new Error("Usuário não encontrado!")
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }

    }


    delete(user) {
        // Higher-order functions (map, filter, find, reduce)
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
       
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


// classe que vai criar a visualização e eventos no HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")
        
            this.add(value)
        }
    }

    update () {
        this.removeAllTr()

    this.entries.forEach(user => {
        const row = this.createRow()

        row.querySelector('.users img').src = `https://github.com/${user.login}.png`
        row.querySelector(".users img").alt = `imagem de ${user.name}`
        row.querySelector(".users a").href = `https://github.com/${user.login}`
        row.querySelector(".users p").textContent = user.name
        row.querySelector('.users span').textContent = user.login
        row.querySelector(".repositories").textContent = user.public_repos
        row.querySelector(".followers").textContent = user.followers
        
        row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza q deseja deletar essa linha?')
        if(isOk) {
            this.delete(user)
        }  
        }
        
        this.tbody.append(row)
    })
    }

    createRow() {
        const tr = document.createElement("tr")

        tr.innerHTML = `
        <tr>
        <td class="users">
            <img src="https://github.com/David-souza1.png" alt="imagem de usuário do Daid Souza do Github">
            <a href="https://github.com/David-souza1" target="_blank">
                <p>David Souza</p>
                <span>David-souza1</span>
            </a>
        </td>
        <td class="repositories">12</td>
        <td class="followers">6</td>
        <td>
            <button class="remove">&times;</button>
        </td>
    </tr>
        `

        return tr
    }
    
    removeAllTr() {
    
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove()
        })
        
    }
}
