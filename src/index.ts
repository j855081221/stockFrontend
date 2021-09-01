import axios from "axios";
import { values } from "lodash";
import { zh } from "./lang";
import { Stock } from "./type";

class Main {
    private tb_stock = document.getElementById("tb_stock") as HTMLTableElement;
   

    private _stock = [] as Stock[];
    private _numRows = 25;
    private _searchResult?: Stock[];

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
        this._stock = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbxuUm9TOuFVD-ZsnsADxD0B7bSW3sN5D6Cy7K0ANI7Tu8QrjLlyZsUwQDxz8fT4Wmu7/exec?func=all")).data;

        // 關閉 Loading 動畫
        const loading = document.getElementById("lds-container") as HTMLDivElement;
        document.body.removeChild(loading);
        
        // 顯示頁碼
        let tempPage = 1;

        const div_pages = document.getElementById("div_pages") as HTMLDivElement;
        div_pages.addEventListener("click", event => {
            //TODO 避開點空白處的問題
            

            const page = +(event.target as HTMLElement).innerHTML;
            console.log((event.target as HTMLElement));
            if((event.target as HTMLElement).id === "div_pages") return;
            // if (isNaN(page)) return;
        
            //點擊更新頁面
            //TODO 更新頁面的方式改成用新增移除class的方式，須預設第 1 頁
            //TODO 這裡可以改寫成方法重複調用
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
            console.log(page);
            document.getElementById(`button${page}`).classList.add("mystyle");

            //this.updateTable(page);

            }
        );


            //監聽DIV做多項條件查詢
            const div_search = document.getElementById("div_search") as HTMLDivElement;
            div_search.addEventListener("click", event => {
                //TODO swithch
                const selectResult = (event.target as HTMLElement).innerHTML;

                switch(selectResult){
                    case "成交量 &gt; 6000":
                        this._searchResult = this._stock.filter(v => v.volume >= 6000)
                        this.updatePage();
                        this.updateTable(1);
                        console.log("查詢條件 成交量 > 6000")
                        break;
                    case "外資買超 &gt; 500":
                        this._searchResult = this._stock.filter(v => v.foreignInvestors >= 500)
                        this.updatePage();
                        this.updateTable(1);
                        break;
                    case "投信買超 &gt; 500":
                        this._searchResult = this._stock.filter(v => v.investmentTrust >= 500)
                        this.updatePage();
                        this.updateTable(1);
                        break;
                    case "強勢股":
                        //漲3%
                        console.log("尚未完成")
                        break; 
                    case "弱勢股":
                        console.log("尚未完成")
                        break; 
                    default:
                        console.log("查詢失敗")
                        break; 
                }
    
                //const page = +(event.target as HTMLElement).innerHTML;
                console.log((event.target as HTMLElement));
                }
            )    

            //NOTE 條件查詢
        /*    
        const _searchA = document.getElementById("searchA") as HTMLElement;
        _searchA.addEventListener("click", event => {
            console.log(this._stock);

           this._searchResult = this._stock.filter(v => v.volume >= 6500)

           
           console.log("update")
           console.log(this._searchResult)

           this.updatePage();
           this.updateTable(1);
           
           //NOTE  表格長度更新問題
           
            //console.log(result);
            }
        )
        */ 

       this.updatePage()
        // for (let i = 1; i < Math.ceil(this._stock.length / this._numRows); i++) {

        //     if(i === 1){
        //         const prev = document.createElement("button"); 
        //         prev.id =`buttonPrev`;
        //         prev.className ="btn-style";
        //         prev.innerHTML = `上一頁`;
        //         div_pages.appendChild(prev); 
        //     }

        //     const btn_page = document.createElement("button");    
        //     btn_page.id =`button${ i }`;
        //     btn_page.className ="btn-style";
        //     btn_page.innerHTML = `${ i }`;
        //     div_pages.appendChild(btn_page);

        //     if(i === Math.ceil((this._stock.length / this._numRows) - 1)){
        //         const next = document.createElement("button"); 
        //         next.id =`buttonNext`;
        //         next.className ="btn-style";
        //         next.innerHTML = `下一頁`;
        //         div_pages.appendChild(next); 
        //     }
        // }

    }

    /**
     * 單純點擊頁面時只更新page內容就好 不用重新再取得資料
     */
    private updatePage(result = this._searchResult || this._stock) {
        const div_pages = document.getElementById("div_pages") as HTMLDivElement;
        div_pages.innerHTML = "";
        for (let i = 1; i <= Math.ceil(result.length / this._numRows); i++) {

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

            if(i === Math.ceil((result.length / this._numRows) )){
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
     * @param result 給第二個預設值，供查詢後回傳結果。
     */
   
    private updateTable(page: number, result = this._searchResult || this._stock) {
        // TODO 做全部資料查詢時要把searchresult給undefined

        // 清除表格內容
        this.tb_stock.innerHTML = "";

        // 標頭
        const header = this.tb_stock.insertRow();
        const stock = result[0];

        Object.keys(stock).forEach(k => {
            const cell = document.createElement("th");
            cell.innerHTML = zh[k];
            header.appendChild(cell); 
        });

        // 更新表格內容
        for (let i = 0 ; i <= this._numRows; i++) {
            const row = this.tb_stock.insertRow();
            const stock = result[(page - 1) * this._numRows + i];

            Object.entries(stock).forEach(([k, v]) => {
                const cell = row.insertCell();
                cell.innerHTML = `${ v }`;
                // 判斷股價漲跌
                if(k === "changeRange")
                    //cell.classList.add("red")
                    v >= 0 ? cell.classList.add("red") : v < 0 ? cell.classList.add("green") : "";
           
                    
                    
            })
        }
    }
}

new Main();
