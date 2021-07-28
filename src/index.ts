import axios from "axios";
import { values } from "lodash";
import { zh } from "./lang";
import { Stock } from "./type";

class Main {
    private tb_stock = document.getElementById("tb_stock") as HTMLTableElement;

    private _stock = [] as Stock[];
    private _numRows = 25;

    constructor() {
        this.fetchStockData().then(() => {
            this.updateTable(1);
        });
    }

    /**
     * 從後端取得股票資訊，並更新頁碼 (只會做一次)
     */
    private async fetchStockData() {
        // 從後端取得資料
        this._stock = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbxLFF-H2dHhx8h5aRM8pIgZQKzWGN3xRUNkPS1PlvyqgHC4KfQ9x591-SzkcLe_ngTF/exec?func=all")).data;

        // 關閉 Loading 動畫
        const loading = document.getElementById("lds-container") as HTMLDivElement;
        document.body.removeChild(loading);
        
        // 顯示頁碼
        let tempPage = 1;

        const div_pages = document.getElementById("div_pages") as HTMLDivElement;
        div_pages.addEventListener("click", event => {
            //TODO 避開點空白處的問題
            

            const page = +(event.target as HTMLElement).innerHTML;
            //點擊更新頁面
            if (page) {
                //console.log(typeof page)
                this.updateTable(page);
                tempPage = page;
                console.log(tempPage);
                //TODO
            }

            if((event.target as HTMLElement).innerHTML === "下一頁"){
                console.log(tempPage);

                
                if(tempPage < Math.ceil(this._stock.length / this._numRows) - 1)
                this.updateTable(++tempPage);
  
            }

            if((event.target as HTMLElement).innerHTML === "上一頁"){
                console.log(tempPage);

                if(tempPage < Math.ceil(this._stock.length / this._numRows) && tempPage > 1)
                this.updateTable(--tempPage);
  
            }
            //NOTE 為什麼不能蓋過原本的background
            //document.getElementById(`button${page}`).classList.add("mystyle");

            //this.updateTable(page);
        });

 

  
        for (let i = 1; i < Math.ceil(this._stock.length / this._numRows); i++) {

            if(i === 1){
                const prev = document.createElement("button"); 
                prev.id =`buttonPrev`;
                prev.className ="btn-style";
                prev.innerHTML = `上一頁`;
                div_pages.appendChild(prev); 
            }

            const btn_page = document.createElement("button");    
            btn_page.id =`button${ i }`;
            btn_page.className ="btn-style";
            btn_page.innerHTML = `${ i }`;
            div_pages.appendChild(btn_page);

            if(i === Math.ceil((this._stock.length / this._numRows) - 1)){
                const next = document.createElement("button"); 
                next.id =`buttonNext`;
                next.className ="btn-style";
                next.innerHTML = `下一頁`;
                div_pages.appendChild(next); 
            }
        }

    }

    /**
     * 根據頁碼更新表格內容
     * @param page 指定的頁面
     */
    private updateTable(page: number) {
        // 清除表格內容
        this.tb_stock.innerHTML = "";

        // 標頭
        const header = this.tb_stock.insertRow();
        const stock = this._stock[0];

        Object.keys(stock).forEach(k => {
            const cell = document.createElement("th");
            cell.innerHTML = zh[k];
            header.appendChild(cell); 
        });

        // 更新表格內容
        for (let i = 0 ; i <= this._numRows; i++) {
            const row = this.tb_stock.insertRow();
            const stock = this._stock[(page - 1) * this._numRows + i];

            Object.entries(stock).forEach(([k, v]) => {
                const cell = row.insertCell();
                cell.innerHTML = `${ v }`;
            })
        }
    }
}

new Main();
