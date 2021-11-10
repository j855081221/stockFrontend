import axios from "axios";
import { Chart, registerables} from "chart.js";
import { result, values } from "lodash";
import { zh } from "./lang";
import { Stock } from "./type";

class Main {
    private tb_stock = document.getElementById("tb_stock") as HTMLTableElement;
    //定義chart的資料型別 及內容
    private _chart = []; 
    private _OTCchart = []; 

    private _stock = [] as Stock[];
    private _numRows = 25;
    private _searchResult?: Stock[];

    constructor() {
        this.fetchStockData().then(() => {
            this.updateTable(1);
        });
        Chart.register(...registerables)
  
        this.StockDataCanvas()
    }
    /*
    * 繪製圖表
    */
    private async StockDataCanvas() {
        //const reuslt = await axios.get<Stock[]>("https://cors-anywhere.herokuapp.com/https://www.twse.com.tw/exchangeReport/MI_INDEX?response=JSON&date=20210824&type=ALLBUT0999")
        this._chart = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbzy9Owb62bjEEeRunQUtN1a5cGJ-lty4bPIEEIhrEDWJCotT9VH9DKf8GOulZ5RioIt/exec?func=chart")).data;
        this._OTCchart = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbzy9Owb62bjEEeRunQUtN1a5cGJ-lty4bPIEEIhrEDWJCotT9VH9DKf8GOulZ5RioIt/exec?func=OTCchart")).data;
        console.log(this._chart);
        const myData = [16460, 16488, 16522, 16500, 16652, 16513,16560, 16388, 16422, 16305, 16658, 16713,]
        // const myPoint = Object.keys(this._chart).map(key => this._chart[key]);
        // console.log(myPoint);

        // let object = {a: 1, b: 2, c: 3};
        // Object.values(object).forEach(key => {
        //   console.log(key);
        // });

        let arr2 = [];
        this._chart.forEach((item, index, array) => {
        arr2.push(parseFloat(array[index].point))
        });
        console.log(arr2);
        let arr3 = arr2.slice(2,100);
        console.log(arr3)

        let arrOTC = [];
        this._OTCchart.forEach((item, index, array) => {
            arrOTC.push(parseFloat(array[index].point))
            });
            console.log(arrOTC);
            let OTCdata = arrOTC.slice(2,100);
            console.log(OTCdata)
    


        const myAxis = [] as string[];

        let startTime = new Date('2021-01-01 09:00:00');
        let endTime = new Date('2021-01-01 13:30:00');
        // 建議改用while迴圈比較好
        let timeCount = 720;

        for (let i = startTime; startTime < endTime; startTime.getSeconds() + 5){

            if(timeCount === 720){
                myAxis.push(startTime.toString().slice(16,24));
                timeCount = 0
            }
            
            else
            myAxis.push("");

            startTime.setSeconds(startTime.getSeconds() + 5);
            
            timeCount += 1  
        }
        console.log(myAxis);

        const ctx3 = (document.getElementById("myChart") as HTMLCanvasElement).getContext("2d");
        const ctx4 = (document.getElementById("OTCmyChart") as HTMLCanvasElement).getContext("2d");
        
        const chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(51, 204, 51)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
        const example3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: myAxis,
                datasets: [{
                    label: '加權指數',
                    backgroundColor: chartColors.red,
                    borderColor: chartColors.red,
                    data: arr2,
                    fill: false,
                    pointRadius: 0,
                }]
            },
            options:{
                scales: {
                    xAxis:{
                        ticks:{
                            //maxTicksLimit:12,
                            stepSize: 720,
                            count: 10,
                        }
                    },
                    yAxis: {
                        min: 16800,
                        max: 17000,
                        ticks: {
                            stepSize: 100
                        }
                    }
                },
        }});

        const example4 = new Chart(ctx4, {
            type: 'line',
            data: {
                labels: myAxis,
                datasets: [{
                    label: '櫃買指數',
                    backgroundColor: chartColors.purple,
                    borderColor: chartColors.purple,
                    data: arrOTC,
                    fill: false,
                    pointRadius: 0,
                }]
            },
            options:{
                scales: {
                    xAxis:{
                        ticks:{
                            //maxTicksLimit:12,
                            stepSize: 720,
                            count: 10,
                        }
                    },
                    yAxis: {
                        min: 210,
                        max: 225,
                        ticks: {
                            stepSize: 2
                        }
                    }
                },
        }});

        // 基本hello world
        // const myChart = new Chart(ctx3, {
        //     type: 'line',
        //     data: {
        //         labels: [],
        //         datasets: []
        //     }, 
               
            
        //     options:{
        //         scales: {
        //             xAxis:{
        //                 ticks:{

        //                 }
        //             }
        //         },
        //         plugins:{                
        //             title:{
        //             display:true,
        //             text:"hello world",
        //             color:'red'
        //             }

        //         }
        //     } 
        // }); 

      
        //長條圖案例 可用
        // const ctx = (document.getElementById("myChart") as HTMLCanvasElement).getContext("2d");
        // // 參數設定[註1]
        // const example = new Chart(ctx, {
        //     type: "bar", // 圖表類型


        //     data: {
        //         labels: [ "Red", "Green", "Blue" ], // 標題
        //         datasets: [{
        //             label: "# of Votes", // 標籤
        //             data: [ 12, 19, 3 ], // 資料
        //             backgroundColor: [ // 背景色
        //             "#FF0000",
        //             "#00FF00",
        //             "#0000FF",
        //             ],
        //             borderWidth: 1 // 外框寬度
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

       
        // 原始範例2
        // const chartColors = {
        //     red: 'rgb(255, 99, 132)',
        //     orange: 'rgb(255, 159, 64)',
        //     yellow: 'rgb(255, 205, 86)',
        //     green: 'rgb(51, 204, 51)',
        //     blue: 'rgb(54, 162, 235)',
        //     purple: 'rgb(153, 102, 255)',
        //     grey: 'rgb(201, 203, 207)'
        // };
        // const example3 = new Chart(ctx3, {
        //     type: 'line',
        //     data: {
        //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //         datasets: [{
        //             label: 'My First dataset',
        //             backgroundColor: chartColors.red,
        //             borderColor: chartColors.red,
        //             data: [10, 30, 39, 20, 25, 34, -10],
        //             fill: false,
        //         }, {
        //             label: 'My Second dataset',
        //             fill: false,
        //             backgroundColor: chartColors.blue,
        //             borderColor: chartColors.blue,
        //             data: [18, 33, 22, 19, 11, 39, 30],
        //         }]
        //     },

        // });


        // const ctx2 = (document.getElementById("myChart") as HTMLCanvasElement).getContext("2d");
        // var myChart = new Chart(ctx2, {
        //     type: 'bar',
        //     data: {
        //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //         datasets: [{
        //             label: '# of Votes',
        //             data: [12, 19, 3, 5, 2, 3],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)',
        //                 'rgba(75, 192, 192, 0.2)',
        //                 'rgba(153, 102, 255, 0.2)',
        //                 'rgba(255, 159, 64, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255, 99, 132, 1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)',
        //                 'rgba(75, 192, 192, 1)',
        //                 'rgba(153, 102, 255, 1)',
        //                 'rgba(255, 159, 64, 1)'
        //             ],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });

        // const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext("2d");
        // const data = {
        //     labels: labels,
        //     datasets: [
        //       {
        //         label: 'Dataset 1',
        //         data: [10, 30, 50, 20, 25, 44, -10],
        //         borderColor: Utils.CHART_COLORS.red,
        //         backgroundColor: Utils.CHART_COLORS.red,
        //       },
        //       {
        //         label: 'Dataset 2',
        //         data: [100, 33, 22, 19, 11, 49, 30],
        //         borderColor: Utils.CHART_COLORS.blue,
        //         backgroundColor: Utils.CHART_COLORS.blue,
        //       }
        //     ]
        //   };

        // const config = {
        //     type: 'line',
        //     data: data,
        //     options: {
        //       responsive: true,
        //       plugins: {
        //         title: {
        //           display: true,
        //           text: 'Min and Max Settings'
        //         }
        //       },
        //       scales: {
        //         y: {
        //           min: 10,
        //           max: 50,
        //         }
        //       }
        //     },
        //   };
          
          
        // const myChart = new Chart(ctx, {
        //     options:{
        //         title:{
        //             display:true,
        //             text:"hello world",
        //             fontColor:'red'
        //         }
        //     }
        // }); 
       
    } 

    /**
     * 從後端取得股票資訊，並更新頁碼 (只會做一次)
     */
    private async fetchStockData() {
        // 從後端取得資料
         this._stock = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbzy9Owb62bjEEeRunQUtN1a5cGJ-lty4bPIEEIhrEDWJCotT9VH9DKf8GOulZ5RioIt/exec?func=all")).data;
        // this._stock = (await axios.get<Stock[]>("https://script.google.com/macros/s/AKfycbxMVYTV4sGIrM2hAspPsOrVYwIYPC0c-jYo6WpMUf8FMYRjcRqgdUE5EePWyW-bBqH3/exec?func=time")).data;

         console.log(this._stock)
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
                document.getElementById(`button${tempPage}`).classList.remove("mystyle");
                this.updateTable(page);
                tempPage = page;
                console.log(tempPage);
                document.getElementById(`button${page}`).classList.add("mystyle");
                //TODO
            }
            
            if((event.target as HTMLElement).innerHTML === "下一頁"){
                console.log(tempPage);
                document.getElementById(`button${tempPage}`).classList.remove("mystyle");
                
                
                if(tempPage < Math.ceil(this._stock.length / this._numRows) - 1)
                this.updateTable(++tempPage);

                document.getElementById(`button${tempPage}`).classList.add("mystyle");
            }

            if((event.target as HTMLElement).innerHTML === "上一頁"){
                console.log(tempPage);
                document.getElementById(`button${tempPage}`).classList.remove("mystyle");
                
                if(tempPage < Math.ceil(this._stock.length / this._numRows) && tempPage > 1)
                this.updateTable(--tempPage);

                document.getElementById(`button${tempPage}`).classList.add("mystyle");
            }
            //NOTE 為什麼不能蓋過原本的background
            console.log(page);
            
            

            //this.updateTable(page);

            }
            
        );


            //監聽DIV做多項條件查詢
            const div_search = document.getElementById("div_search") as HTMLDivElement;
            div_search.addEventListener("click", event => {
                //TODO swithch
                const selectResult = (event.target as HTMLElement).innerHTML;
                // 用於尋找html data命名 console.log((event.target as any).dataset.volume)
                switch(selectResult){
                    case "成交量 &gt; 6000":
                        this._searchResult = this._stock.filter(v => v.volume >= 6000)
                        this.updatePage();
                        this.updateTable(1);
                        tempPage = 1;
                        console.log("查詢條件 成交量 > 6000")
                        break;
                    case "外資買超 &gt; 500":
                        // filter篩選資料後用sort將資料由大到小排序
                        this._searchResult = this._stock.filter(v => v.foreignInvestors >= 500).sort(function (a, b) {
                            return a.foreignInvestors < b.foreignInvestors ? 1 : -1;
                           });
                        console.log(this._searchResult)

                        this.updatePage();
                        this.updateTable(1);
                        tempPage = 1;
                        break;
                    case "投信買超 &gt; 500":
                        this._searchResult = this._stock.filter(v => v.investmentTrust >= 500)
                        this.updatePage();
                        this.updateTable(1);
                        tempPage = 1;
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
        document.getElementById(`button${1}`).classList.add("mystyle");
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
