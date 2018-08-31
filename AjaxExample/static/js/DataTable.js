function DataTable(container, headerValues, rowValues, elCount) {
    this.container = container ? container : '.container';
    this.headerValues = headerValues;
    this.rowValues = rowValues;
    this.data = rowValues;
    this.elCount = elCount ? elCount : 10;
    this.totalPage = Math.ceil(rowValues.length / this.elCount);
    this.sort = false;
    this.currentPage = 1;
    this.pageData = [];
    this.searchableCols = [];
    this.rowDatas = [];
    this.table = document.createElement("table");
    get(this.container).appendChild(this.table);
}
function get(el) {
    return document.querySelector(el);
}
DataTable.prototype = {
    constructor: DataTable,
    initHeader: function(){
        const that = this;
        let tr = document.createElement("tr");
        tr.setAttribute("class","header");
        this.table.appendChild(tr);
        that.headerValues.map(function (value, index){
            let th = document.createElement("th");
            th.textContent = value.name;
            th.setAttribute("key",value.key);
            let sort_down = document.createElement("img");
            sort_down.setAttribute("src","/static/img/icons/sort-down.svg");
            sort_down.setAttribute("class","hide");
            th.appendChild(sort_down);
            let sort_up = document.createElement("img");
            sort_up.setAttribute("src","/static/img/icons/sort-up.svg");
            sort_up.setAttribute("class","hide");
            th.appendChild(sort_up);
            if(value.searchable)
                that.searchableCols.push(index);
            tr.appendChild(th);
            th.addEventListener("click",function (e) {
                let sort_by = function(field, reverse, primer){

                    var key = primer ?
                        function(x) {return primer(x[field])} :
                        function(x) {return x[field]};

                    reverse = !reverse ? 1 : -1;

                    return function (a, b) {
                        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                    }
                };
                let sort={};
                for(let item of that.table.querySelectorAll("img"))
                    item.setAttribute("class","hide");
                if(that.sort && that.sort[value.key]){
                    if(that.sort[value.key] === "asc") {
                        sort_down.setAttribute("class", "hide");
                        sort_up.setAttribute("class", "");
                        that.data=that.data.sort(sort_by(value.key, true));
                    }
                    else{
                        sort_up.setAttribute("class", "hide");
                        sort_down.setAttribute("class", "");
                        that.data=that.data.sort(sort_by(value.key, false));
                    }
                    sort[value.key]= that.sort[value.key] === "asc" ? "desc" : "asc";
                }
                else{
                    sort[value.key]= "asc";
                    sort_up.setAttribute("class", "hide");
                    sort_down.setAttribute("class", "");
                    that.data=that.data.sort(sort_by(value.key, false));
                }
                that.sort= sort;
            })
        });
    },
    create: function () {
        const that = this;
        if(!that.table.querySelectorAll("th").length){
            that.initHeader();
        }
        this.data.map(function (value, index_) {
            let tr_data = document.createElement("tr");
            tr_data.setAttribute("class","table-row");
            that.headerValues.map(function (value2, index) {
                let td = document.createElement("td");
                td.setAttribute("class","table-td");
                if(value2.checkbox) {
                    td.setAttribute("class", "static-width");
                    let checkbox = document.createElement("input");
                    checkbox.setAttribute("type","checkbox");
                    checkbox.setAttribute("name", index + "_" + index_);
                    checkbox.setAttribute("id", index + "_" + index_);
                    td.appendChild(checkbox);
                    tr_data.appendChild(td);
                }
                else if(value2.input) {
                    td.setAttribute("class", "static-width");
                    let input = document.createElement("input");
                    input.setAttribute("type",value2.input);
                    td.appendChild(input);
                    tr_data.appendChild(td);
                }
                else{
                    td.innerHTML = value[value2.key];
                    tr_data.appendChild(td);
                }
                that.table.appendChild(tr_data);
            });
            that.rowDatas.push(tr_data);
        });
        that.pageData = that.rowDatas;
        // RowSorter(that.table,{tbody: true,    stickTopRows: 1
        // })
    },
    update: function (data) {
        let rows=this.table.querySelectorAll("tr");
        for(let i=1;i<rows.length;i++){
            rows[i].remove();
        }
        this.create();
    },
    search: function (text) {
        const that = this; let filteredValues = [];
        that.rowDatas.forEach(function (value) {
            let data = value.find("td"), added = false;
            that.headerValues.map(function (value2, index2){
                if(value2.searchable){
                    let cellValue = data[index2].html().toString().toLowerCase();
                    if(cellValue.indexOf(text.toString().toLowerCase()) > -1 && !added) {
                        value.setAttribute("filtered",true);
                        value.css({display: ''});
                        added = true;
                        filteredValues.push(value);
                    }
                    else if(!added){
                        value.setAttribute("filtered",false);
                        value.css({display: 'none'})
                    }
                }
            });
        });
        this.currentPage = 1;
        that.pageData = filteredValues;
        this.totalPage = Math.ceil(filteredValues.length/that.elCount);
        this.show(1,that.pageData)
    }
};