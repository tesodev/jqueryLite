function DragTable(target, options) {
    this.offsetX = 5;
    this.offsetY = 5;
    this.container = target.el[0];
    this.options = {
        columnDragHandle: null,
        rowDragHandle: null,
        resize: true,
        columnOnDragClass: "columnOnDrag",
        rowOnDragClass: "rowOnDrag",
        onIndexChange: null
    };
    Object.assign(this.options, options);
    console.log(this.options)
}
DragTable.prototype= {
    constructor: DragTable,
    createColumnSort: function () {
        const that=this;
        $(this.container).find("th").each(function (header,headerIndex) {
            if(that.options.columnDragHandle)
                $(header).find(that.options.columnDragHandle).off("mousedown").on("mousedown", function (event) {
                    that.selectColumn($(header), event);
                });
            else
                $(header).off("mousedown").on("mousedown", function (event) {
                    that.selectColumn($(header), event);
                });
            $(document).off("mouseup").on("mouseup", function (event) {
                event.preventDefault();
                if(that.selectedHeader){
                    $("."+that.options.columnOnDragClass).removeClass(that.options.columnOnDragClass);
                    that.draggableContainer = null;
                    that.selectedHeader = null;
                    $(".tesodev_draggable_column").remove();
                    $(".resizer").css("display","block");
                }
            });
        });
        if(that.options.resize)
            that.resize()
    },
    selectColumn: function(header, event) {
        event.preventDefault();
        if(event.which===1) {
            const that = this;
            $(".resizer").css("display","none");
            this.selectedHeader = header;
            header.addClass(that.options.columnOnDragClass);
            let sourceIndex = this.selectedHeader.index(), cells = [];
            $(this.container).find("tr").each(function (row, rowIndex) {
                $(row).find("td").each(function (cell, cellIndex) {
                    if (cellIndex === sourceIndex) {
                        cells[cells.length] = cell;
                        $(cell).addClass(that.options.columnOnDragClass);
                    }
                });
            });

            this.draggableContainer = $("<div/>");
            this.draggableContainer.addClass("tesodev_draggable_column");
            function createDraggableTable(header, event) {
                let table = $("<table/>"), thead = $("<thead/>"), tbody = $("<tbody/>"),
                    tr = $("<tr/>"), th = $("<th/>");
                $(table).addClass($(that.container).attr("class"));
                $(table).css({width: $(header).css("width")});
                $(th).html($(header).html());
                $(tr).append(th);
                $(thead).append(tr);
                $(table).append(thead);
                $(table).append(tbody);
                return table;
            }
            let dragtable = createDraggableTable(header);
            $(cells).each(function (cell, cellIndex) {
                let tr = $("<tr/>");
                let td = $("<td/>");
                $(td).html($(cells[cellIndex]).html());
                $(tr).append(td);
                $(dragtable).find("tbody").append(tr);
            });
            this.draggableContainer.append(dragtable);
            this.draggableContainer.css({
                position: "absolute",
                left: event.pageX + this.offsetX + "px",
                top: event.pageY + this.offsetY + "px"
            });
            this.draggableContainer.addClass("hide");
            $("body").append(this.draggableContainer);
            function mousemove(event) {
                if (that.selectedHeader) {
                    if (that.selectedHeader !== null) {
                        that.draggableContainer.removeClass("hide");
                        that.draggableContainer.css({
                            left: event.pageX + that.offsetX + "px",
                            top: event.pageY + that.offsetY + "px"
                        });
                        that.moveColumn(event)
                    }
                }
            }
            $(document).unbind("mousemove",mousemove);
            $(document).on("mousemove",mousemove);
        }
    },
    moveColumn: function(event) {
        event.preventDefault();
        const that =this;
        let target = document.elementFromPoint(event.pageX,event.pageY);
        if(target && target.tagName.toLowerCase() === "th") {
            let sourceIndex = this.selectedHeader.index(),
                targetIndex = $(target).index();
            if (sourceIndex !== targetIndex && typeof targetIndex === "number") {
                typeof that.options.onIndexChange === "function" ?
                    that.options.onIndexChange(sourceIndex,targetIndex, "column") : "";
                $(this.container).find("tr").each(function (row, rowIndex) {
                    $(row).find("th").each(function (v, i) {
                        if (i === targetIndex) {
                            if (sourceIndex < targetIndex)
                                $($(row).find("th").el[sourceIndex]).before(v);
                            if (sourceIndex > targetIndex)
                                $($(row).find("th").el[sourceIndex]).after(v);
                        }
                    });
                    $(row).find("td").each(function (v, i) {
                        if (i === targetIndex) {
                            if (sourceIndex < targetIndex)
                                $($(row).find("td").el[sourceIndex]).before(v);
                            if (sourceIndex > targetIndex)
                                $($(row).find("td").el[sourceIndex]).after(v);
                        }
                    });
                });
            }
        }
    },
    createRowSort: function () {
        const that=this;
        $(this.container).find("tr:not(:first-child)").each(function (row,rowIndex){
            if(that.options.rowDragHandle){
                $("."+that.options.rowDragHandle).find(that.options.rowDragHandle).off("mousedown").on("mousedown", function (event) {
                    that.selectRow($(row), event);
                });
            }
            else {
                $(row).off("mousedown").on("mousedown", function (event) {
                    that.selectRow($(row), event);
                });
            }
            $(document).off("mouseup").on("mouseup", function (event) {
                event.preventDefault();
                if(that.selectedRow){
                    $(row).removeClass(that.options.rowOnDragClass);
                    that.draggableContainer = null;
                    that.selectedRow = null;
                    $(".tesodev_draggable_row").remove();
                    $(".resizer").css("display","block");
                }
            });
        });
    },
    selectRow: function(row, event) {
        event.preventDefault();
        if(event.which===1) {
            const that = this;
            this.selectedRow = row;
            row.addClass(that.options.rowOnDragClass);
            this.draggableContainer = $("<div/>");
            this.draggableContainer.addClass("tesodev_draggable_row");

            function createDraggableTable(row) {
                let table = $("<table/>"), tbody = $("<tbody/>");
                $(table).addClass($(that.container).attr("class"));
                $(table).css({width: $(row).css("width")});
                $(table).append(tbody);
                return table
            }
            let dragtable = createDraggableTable(row);
            $(dragtable).find("tbody").append(row.clone());
            this.draggableContainer.append(dragtable);
            this.draggableContainer.css({
                position: "absolute",
                left: event.pageX + this.offsetX + "px",
                top: event.pageY + this.offsetY + "px"
            });
            this.draggableContainer.addClass("hide");
            $("body").append(this.draggableContainer);
            function mousemove(event) {
                if (that.selectedRow !== null) {
                    that.draggableContainer.removeClass("hide");
                    that.draggableContainer.css({
                        left: event.pageX + that.offsetX + "px",
                        top: event.pageY + that.offsetY + "px"
                    });
                    that.moveRow(event)
                }
            }
            $(document).unbind("mousemove",mousemove);
            $(document).on("mousemove",mousemove);
        }
    },
    moveRow: function(event) {
        event.preventDefault();
        let target = document.elementFromPoint(event.pageX,event.pageY);
        const that = this;
        if(target && target.tagName.toLowerCase() === "td"){
            target=target.parentNode;
            let sourceIndex = this.selectedRow.index(), targetIndex = $(target).index();
            if (sourceIndex !== targetIndex && typeof targetIndex === "number") {
                typeof that.options.onIndexChange === "function" ?
                    that.options.onIndexChange(sourceIndex,targetIndex, "row", that.selectedRow) : "";
                $(this.container).find("tr").each(function (row,rowIndex) {
                    if(rowIndex === targetIndex){
                        if(sourceIndex<targetIndex) {
                            $($(that.container).find("tr").el[sourceIndex]).before(row);
                        }
                        if(sourceIndex>targetIndex) {
                            $($(that.container).find("tr").el[sourceIndex]).after(row);
                        }
                    }
                });
            }

        }
    },
    resize: function () {
        let thElm, startOffset;
        $(".resizer").remove();
        $(this.container).find("th").each(function (header,headerIndex) {
            header.style.position = 'relative';
            let grip = document.createElement('div');
            grip.className="resizer";
            grip.innerHTML = "&nbsp;";
            grip.style.top = 0;
            grip.style.right = -2+"px";
            grip.style.bottom = 0;
            grip.style.width = '5px';
            grip.style.position = 'absolute';
            grip.style.cursor = 'col-resize';
            function mousedown(e) {
                e.preventDefault();
                thElm = header;
                startOffset = header.offsetWidth - e.pageX;
                e.stopPropagation();
            }
            grip.removeEventListener('mousedown',mousedown);
            grip.addEventListener('mousedown', mousedown);
            header.appendChild(grip);
        });
        function mousemove(e) {
            if (thElm) {
                thElm.style.width = startOffset + e.pageX + 'px';
            }
        }
        document.removeEventListener('mousemove', mousemove);
        document.addEventListener('mousemove', mousemove);

        document.addEventListener('mouseup', function () {
            thElm = undefined;
        });
    }
};