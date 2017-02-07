angular.module("dataQuery",["ng"]).controller("mainCtrl",["$scope","$rootScope","$http","$interval","$timeout",function($scope,$rootScope,$http,$interval,$timeout){
    $scope.change = function(){ //显示更改密码框
        $("#changePwd").show(500);
    }

    $scope.resetPwd = function(){  //重置用户密码
        $("#resetPwd").show(500)
    }

    $scope.$watch("uname",function(){
       $rootScope.uname =  $scope.uname;
    });

    //用于关闭修改密码框
    $scope.close = function(){
        $("#changePwd").hide(500);
    }

    //用于关闭弹出框
    $scope.closeAlert = function(){
        $("#selectAlert").fadeOut(500);
    }

    //重新加载数据
    $scope.refresh = function(){
        !$scope.pager && ($scope.pager = true);        //如分面隐藏，则改为显示
        if($scope.uname !="apy"){
            $http.get("data/getProducts_pager.php?name="+$rootScope.uname + "&pno=1").success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                //$scope.products = data['data']['products'];
                $scope.products = $scope.changeAdId(data['data']['products'],"adID");  //将广告ID为 "0"，进行转换
                $rootScope.products = $scope.products;
                data['page_count'] > 1 && $scope.createBtn(data,1);  //如果只有一页，侧不分页显示
                $scope.pagerClick();     //为分页添加点击效果
            });

            //获取安装量
            $http.get("data/getProducts.php?name="+$rootScope.uname).success(function(data){
                $rootScope.total = $scope.getInstallTotal(data);
            });

            $("#addEdit").css("display","none");
        }
        else{
            $http.get("data/getAllProducts_pager.php?pno=1").success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                data['data']['products'] = $scope.changeEffeDate(data['data']['products']);
                //$scope.products = data['data']['products'];
                $scope.products = $scope.changeAdId(data['data']['products'],"adID");  //将广告ID为 "0"，进行转换
                $rootScope.products = $scope.products;
                $rootScope.total = $scope.getInstallTotal($scope.products);
                //clone对象$scope.proudcts赋值给$rootScope.oldProducts
                for(var i=0; i< $scope.products.length; i++){
                    $rootScope.oldProducts[i] = {};
                    for(var key in $scope.products[i]){
                        $rootScope.oldProducts[i][key] = $scope.products[i][key];
                    }
                }

                data['page_count'] > 1 && $scope.createBtn(data,1);  //如果只有一页，侧不分页显示
                $scope.pagerClick();     //为分页添加点击效果

                //获取总安装量
                $http.get("data/getAllProducts.php").success(function(data){
                    $rootScope.total = $scope.getInstallTotal(data);
                });
            });
        }
        $scope.clearSearchHistroy();//清除之前的历史记录
    }

    //console.log($scope.effectiveDate);
    //console.log($scope.endDate);

    //用于产品搜索
    $scope.search = function() {
        $scope.pager = false;      //分页隐藏
        //仅本公司才可相看所有的信息
        if($rootScope.uname == "apy"){       /*********/
            if ($scope.productName || $scope.channelNum || $scope.company || $scope.coopType ||
                $scope.effectiveDate || $scope.endDate) {
                undefineChangeNull();
                var params = "productName=" + $scope.productName + "&channelNum=" + $scope.channelNum +
                    "&company=" + $scope.company + "&cooperateType=" + $scope.coopType + "&effectiveDate=" + ($scope.effectiveDate ? $scope.effectiveDate.getTime() : '') + "&endDate=" + ($scope.endDate ? $scope.endDate.getTime() : '');
                $http.get("data/newSelectDataV2.php?" + params).success(function(data) {
                    $scope.arrSort(data,"effectiveDate");
                    data = $scope.changeEffeDate(data);
                    //$scope.products = data;
                    $scope.products = $scope.changeAdId(data,"adID");
                    $scope.total = $scope.getInstallTotal($scope.products);
                    if (!data.length) {
                        console.log("没查找到符合你要求的数据!!");
                        $("#selectAlert").fadeIn(500);
                    }
                });
            }
        }
        else{  //非本公司用户只可查看自己所在公司的信息 /////////////////////
            if($scope.productName || $scope.channelNum || $scope.company || $scope.cooperateType ||
                $scope.effectiveDate || $scope.endDate){
                if($scope.effectiveDate) {var effeDate = $scope.effectiveDate.getTime();}
                else {var effeDate = "";}
                if($scope.endDate){var endDate = $scope.endDate.getTime();}
                else {var endDate = "";}
                undefineChangeNull();
                var params =  $scope.productName + "&channelNum=" + $scope.channelNum + "&company=" + $scope.company +
                    "&cooperateType=" + $scope.coopType + "&uname=" + $scope.uname + "&effectiveDate=" + effeDate +
                    "&endDate=" +  endDate;
                $http.get("data/newSelectData_self.php?productName=" + params).success(function(data){
                    $scope.arrSort(data,"effectiveDate");
                    //$scope.products= data;
                    $scope.products = $scope.changeAdId(data, "adID");     //将adID等于 "0" 进行转换
                    $rootScope.total = $scope.getInstallTotal($scope.products);
                    if(!data.length){
                        console.log("没查找到符合你要求的数据!!");
                        $("#selectAlert").fadeIn(500);
                    }
                });
            }
        }                               /////////////////////////////
    }

    function undefineChangeNull(){
        if(!$scope.productName){ $scope.productName = "";}
        if(!$scope.channelNum){ $scope.channelNum = "";}
        if(!$scope.company){ $scope.company = "";}
        if(!$scope.coopType){ $scope.coopType = "";}
        // if(!$scope.effectiveDate){ $scope.effectiveDate = new Date();}
        // if(!$scope.endDate){ $scope.endDate = new Date();}
    }

    //删除当前行
    $scope.addRows = function(){
        if($rootScope.uname == "apy"){   /*** 仅本公司用户才有权增加新用户 **/
        $("#editContent").show(500);
        }
    }
    //跳转到后台编辑页面
    $scope.jumpPage = function(uname) {
        window.open("editBack02.html?"+uname);
    }

    $scope.index = 0;
    //打开后台编辑窗口
    $scope.openEditWindow = function(){
        $scope.index = this.$index;
        $("#editContent").show(500);
    }

    $scope.inputProductInfo = function(){
        $("#inputProductInfo").show(500);
    }

    $scope.delRow = function(){
        console.log(this.$index);
        if(confirm){
        $scope.products.splice(this.$index,1);
        }
    }

    //反转排序
    $scope.reverseArr = function(){
        $scope.products.reverse();
    }

    //日期格式转换(毫秒数组=>日期数组)
    function millionSecondChangeDate(data){
        $.each(data,function(i){
            data[i].effectiveDate=new Date(data[i].effectiveDate);
        });
    }

    //将毫秒转换成日期
    $scope.changeDate = function(millonS){
        var newDate = new Date(millonS*1);
        return newDate.toLocaleDateString().replace(/\//g,"-");
    }

    $scope.arrSort = function(data, vari){
        for(var i = 1; i <data.length; i++){
            for(var j = 0,temp={}; j < data.length - i; j++ ){
                if(data[j][vari]*1 < data[j+1][vari]*1){
                    temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
    }

    //将生效日期的毫秒数转换成"2016-9-16"格式
    $scope.changeEffeDate = function(data){
        for(var i = 0; i < data.length; i++){
            var date =  new Date(data[i].effectiveDate*1);
            data[i].effectiveDate = date.toLocaleDateString().replace(/\//g,"-");
        }
        return data;
    }


    var jsonCount = {}
    $('#table-data').on('click', '[sort-by]', function(e) {
        var sSortBy = $(this).attr('sort-by')
        // $scope.products
        jsonCount[sSortBy] = jsonCount[sSortBy] || 0
        jsonCount[sSortBy]++
        var isDesc = jsonCount[sSortBy] % 2
        $scope.products.sort(function(a0, a1) {
            //installCount price
            if (sSortBy == 'installCount' || sSortBy == 'price') {
                // 按照数字排序
                return isDesc ? a0[sSortBy] - a1[sSortBy] : a1[sSortBy] - a0[sSortBy]
            } else {
                // 自然序
                return isDesc ? a0[sSortBy].localeCompare(a1[sSortBy]) : a1[sSortBy].localeCompare(a0[sSortBy])
            }
        })
        $scope.$apply()
    })

    // $('#login-container').hide()
    $('#searchAppend').on('input', function() {
        $scope.products.forEach(function(item, idx) {
            item.isHide = false
        })
        $(this).find('[filter]').each(function() {
            var sModel = $(this).attr('filter')
            var val = this.value
            $scope.products.forEach(function(item, idx) {
                item.isHide = item.isHide || (val && (item.isHide = (item[sModel] || '').toLowerCase() != (val || '').toLowerCase()))
            })
        })
        $scope.$apply()
    })

    //两小时自动刷新页面
    $interval(function(){
        !$scope.pager && ($scope.pager = true);        //如分页隐藏，则改为显示
        if($scope.uname !="apy"){
            $http.get("data/getProducts_pager.php?name="+$rootScope.uname + "&pno=1").success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                $scope.products = $scope.changeAdId(data['data']['products'], "adID");
                $rootScope.products = $scope.products;
                data['page_count'] > 1 && $scope.createBtn(data,1); //如果只有页
                $scope.pagerClick();     //为分页添加点击效果
            });

            //获取安装量
            $http.get("data/getProducts.php?name="+$rootScope.uname).success(function(data){
                $rootScope.total = $scope.getInstallTotal(data);
            });

            $("#addEdit").css("display","none");
        }
        else{
            $http.get("data/getAllProducts_pager.php?pno=1").success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                data['data']['products'] = $scope.changeEffeDate(data['data']['products']);
                //$scope.products = data['data']['products'];
                $scope.products = $scope.changeAdId(data['data']['products'],"adID");
                $rootScope.products = $scope.products;
                $rootScope.total = $scope.getInstallTotal($scope.products);
                //clone对象$scope.proudcts赋值给$rootScope.oldProducts
                $rootScope.oldProducts = null;    //清空$rootScope.oldProducts
                for(var i=0; i< $scope.products.length; i++){
                    $rootScope.oldProducts[i] = {};
                    for(var key in $scope.products[i]){
                        $rootScope.oldProducts[i][key] = $scope.products[i][key];
                    }
                }

                data['page_count'] > 1 && $scope.createBtn(data,1); //如果只有页
                $scope.pagerClick();     //为分页添加点击效果

                //获取总安装量
                $http.get("data/getAllProducts.php").success(function(data){
                    $rootScope.total = $scope.getInstallTotal(data);
                });
            });
        }
        $scope.$apply();
    },1000*3600*2)

    /*$scope.InsertDataReplaceOldData = function(newData){
        $rootScope.products = newData;
        console.log($scope.products);
        //$scope.$apply();
    }*/


    /******** 编辑与保存数据 *************/
    $scope.editable = true; //安装量是否可编辑
    $scope.autoComplete = "off";  //获取焦点
    $rootScope.oldProducts = [];    //保存现有的数据

    //保存用户编辑的数据
    //loadData();

    //点击变为可编辑状态
    $scope.changeDis = function(){
        $scope.oldInstallCount = parseInt(this.data.installCount);
        $scope.editable=false;
        $scope.autocomplete = "on";
    }

    //检测用户输入的格式是否正确,并返一个日期的毫秒数
    $scope.checkDate = function(date){
        var dateReg = /^\d{4,}(-|\/)1[0-2]|[1-9]{1,2}(-|\/)\d{1,2}$/;  //匹配年月日
        var dateReg02 = /^([0-2][0-9](?!(00)))|3[0-1]|[1-9]$/;         //精确匹配日
        var dateReg03= /^\d{4,}年(1[0-2]|[0-9]{1,2})月(([0-2][0-9](?!(00)))|3[0-1]|[1-9])日$/;//匹配 "2016年9月16日" 格式
        if(dateReg.test(date) && dateReg02.test(date.substr(date.length-2)) || dateReg03.test(date)){
            if(dateReg03.test(date)){date = (date.replace(/(年|月)/g,"-").substr(0,9));}   //取出 “年月日"
            var currentDate = new Date(date).getTime();
            //用户输入的日期不得>(当前日期加一年)
            if(currentDate <= new Date().getTime()+1000*3600*24*365) {return currentDate;}
            else{return 0;}
        }
        else { return 0;}
    }

    //保存修改后的数据
    $scope.saveEditData = function($index){
        if($scope.editable == false){
            var reg =/\d/g;
            var checkAdId = reg.test($scope.products[$index].adID) || $scope.products[$index].adID == "";

            if(reg.test($scope.products[$index].installCount) && $scope.checkDate($scope.products[$index].effectiveDate) && checkAdId){
                $scope.products[$index].effectiveDate = $scope.checkDate($scope.products[$index].effectiveDate);
                $scope.products[$index].effectiveDate = new Date($scope.products[$index].effectiveDate).toLocaleString().replace(/\//g,"-").substr(0,10);

                $http.get("data/saveInstallCountV2.php?installCount="+$scope.products[$index].installCount+"&productName="+
                    $scope.products[$index].productName+"&channelNum="+$scope.products[$index].channelNum+"&company="+
                    $scope.products[$index].company+"&price="+$scope.products[$index].price+ "&effectiveDate="+
                    new Date($scope.products[$index].effectiveDate).getTime() + "&did="+ $scope.products[$index].did +
                    "&adPlatform=" + $scope.products[$index].adPlatform + "&adID=" + $scope.products[$index].adID).success(function(data){
                    var currentTD = $("#table-data tbody tr").eq($index);
                    if(data == "Update Succ!"){
                        console.log("修改成功");
                        //保存之前的背景颜色
                        var prevBackColor = currentTD.css("background");
                        currentTD.css("background","#81E3D6");
                        //5秒之后恢复之前的颜色
                        $timeout(function(){
                            currentTD.css("background",prevBackColor);
                        },5000);
                        $scope.total += parseInt($scope.products[$index].installCount) - $scope.oldInstallCount;
                    }
                    else{
                        var previousColor = currentTD.css("color");
                        currentTD.css("color","#f00");
                        //5秒之后恢复之前的颜色
                        $timeout(function(){
                            currentTD.css("color",previousColor); //恢复之前的颜色
                            $scope.abandon($index);                //恢复之前的数据
                        },5000);
                    }
                });
            }
            else{
                console.log("输入的必须为数字或输入的日期格式不对!!");
            }
        }
    }

    //不保存修改后的数据
    $scope.abandon = function($index){
        if(!$scope.editable){
            //console.log($index)
            //console.log($scope.products[$index].did);
            //console.log($scope.products,oldProducts);
            //console.log($scope.products.length,oldProducts.length);
            var did = $scope.products[$index].did; //找到点击对应的did;
            var index = returnIndex(did,$scope.oldProducts);    //根据did找到之前的index
            //console.log(index);
            //console.log(oldProducts[index].installCount);
            //将之前的数据读回去
            $scope.products[$index].installCount = $rootScope.oldProducts[index].installCount;
            //$scope.editable = true;
        }
    }

    //根成did查找对应的index值
    function returnIndex(did,data){
        for(var i = 0; i <data.length; i++){
            //console.log(data[i].did);
            if(data[i].did == did){ return i;}
        }
    }

    //清除历史搜索记录
    $scope.clearSearchHistroy=function(){
        //console.log("clear");
        $scope.productName="";
        $scope.channelNum = "";
        $scope.cooperateType = "";
        $scope.company = "";
        $scope.effectiveDate = "";
        $scope.endDate = "";
    }

    //将密码加密与解密
    $scope.encipher = function(str){
        var strArr = str.split("");  //将字符串转换成数组
        for(var i= 0; i < strArr.length; i++){
            strArr[i] = strArr[i].charCodeAt()+6*(i+1);
        }
        return strArr.join(",");
    }

    $scope.decipher = function(enstr){
        var destr = enstr.split(",");            ///////////
        for(var i=0; i<destr.length; i++){
            destr[i] = String.fromCharCode(destr[i]-6*(i+1));
        }
        return destr.join("");
    }

    //获取总安装量
    $scope.getInstallTotal = function(products){
        //console.log(products);
        var total = null;
        for(var i = 0; i < products.length; i++){
            total += parseInt(products[i].installCount);
        }
        return total;
    }

    $scope.pager = true;     //用于控制分布的显示
    var page_count = 0;       //用于保存总页数
    const PAGEQUANTITY = 5;   //用于设置页签的个ovtn
    //创建分页标签
    $scope.createBtn = function(pager,pno){
        $('.pager_custom').empty();
        page_count = pager.page_count;

        //"上一页"标签
        $('.pager_custom').append('<li><a href = "#">上一页</a></li>');

        for(var i = 1; i <= pager.page_count; i++)
        {
            if(i == pno)
            {
                $(".pager_custom").append('<li class = "active"><a href = "#">'
                    +pager.cur_page + '</a></li>');
            }
            else
            {
                $(".pager_custom").append('<li><a href = "#">'
                    +i+'</a></li>');
            }

            if(i >= PAGEQUANTITY && i < pager.page_count){   //超过18页，则用省略号代替
                $(".pager_custom").append('<span>...</span>')
                break
            }
        }

        //"下一页"标签
        $('.pager_custom').append('<li><a href = "#">下一页</a></li>');

        //添加 "最后页" 标签
        //i < pager.page_count && $('.pager_custom').append('<li><a href="#">最后一页</a></li>');
    }

    //根据用户点击的页数获取数据
    function pagerShow(uname, pno){
        if(uname !="apy"){
            $http.get("data/getProducts_pager.php?name="+ uname + "&pno=" + pno).success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                $scope.products = null;
                $rootScope.products = null;
                $scope.products = $scope.changeAdId(data['data']['products'],"adID");
                $rootScope.products = $scope.products;
            });
        }
        else{
            $http.get("data/getAllProducts_pager.php?pno=" + pno).success(function(data){
                $scope.arrSort(data['data']['products'],"effectiveDate");
                data['data']['products'] = $scope.changeEffeDate(data['data']['products']);
                $scope.products = null;
                $rootScope.products = null;
                $scope.products = $scope.changeAdId(data['data']['products'],"adID");
                $rootScope.products = $scope.products;
            });
        }
    }

    //为分页添加点击效果
    $scope.pagerClick = function(){
        const COUNT = 2;  //点击li向后或者向前添加2个li

        $("ul.pager_custom >li > a").on("click",function(e){
            e.preventDefault();
            var target = e.target || e.srcElement;
            var currentPno = $(target).parent().siblings(".active").children(0).html();
            //var pager_count = $("ul.pager_custom > li:last").prev().children(0).html();

            //var pager_count = $("ul.pager_custom > li:last").prev().html() == "..." ?
                //$("ul.pager_custom > span:last").prev().children(0).html() : $("ul.pager_custom > li:last").prev().children(0).html();

            var lis = $("#mainContent > ul.pager_custom > li").length;    //获取所有li的数量
            var currentIndex = $("#mainContent > ul.pager_custom > li").index(this.parentNode);
            var currValue = parseInt(target.innerHTML);

            if(/\d/.test(target.innerHTML)){
                //$(this).parent().addClass("active").siblings(".active").removeClass("active");
                if(target.parentElement.className == "active")return;
                changeAllValue(currentIndex, lis)
            }
            else if(target.innerHTML == "上一页" && currentPno != "1"){
                if(!(currentPno == 3 && $(target).parent().siblings(".active").prev()[0].tagName == "SPAN")){
                    checkEllipsis(1,lis);
                    $(target).parent().siblings(".active").removeClass("active").prev().addClass("active");
                }
            }
            else if(target.innerHTML == "下一页" && currentPno <= page_count){
                currentPno < page_count && $(target).parent().siblings(".active").removeClass("active").next().addClass("active");
                checkEllipsis(-1,lis);
            }

            //点击"上一页"时,当前的.active的a下的内容大于1时
            if(target.innerHTML == "上一页" && (parseInt(currentPno) > 1)){
                pagerShow($scope.uname,parseInt(currentPno)-1);
            }
            else if(target.innerHTML == "下一页" && (parseInt(currentPno) < page_count )){
                pagerShow($scope.uname,parseInt(currentPno)+1)
            }
            else if(parseInt(target.innerHTML) != parseInt(currentPno)){
                !isNaN(parseInt(target.innerHTML)) && pagerShow($scope.uname,currValue);
            }
        })

        //点击 "上一页" 与 "下一页"时，检查是不是要删除省略号
        function checkEllipsis(drection, lis){
            var currentPno = $('ul.pager_custom > li').siblings(".active").children(0).html() || 1;   //当前页

            var pager_count = $("ul.pager_custom > li:last").prev().html() == "..." ?                 //最后一页的值
                $("ul.pager_custom > span:last").prev().children(0).html() : $("ul.pager_custom > li:last").prev().children(0).html();

            var currentIndex = $('ul.pager_custom > li').siblings(".active").index();   //当页index 值
            var lastIndex = currentIndex + (pager_count - currentPno);                       //最后页的index
            var All_a = $("ul.pager_custom > li > a");   //找到所有ul > li >a

            //如果第三个页签为值为4时,并且为当前页时
            if(All_a[3].innerHTML == 4 && $(All_a[3]).parent().hasClass("active") /*|| All_a[2].innerHTML == 3*/){
                console.log(All_a[3].innerHTML == 4 && $(All_a[3]).parent().hasClass("active"))
                //如果第一个页签后面有 "span" ，则把它删除
                $(All_a[1]).parent().next()[0].tagName == "SPAN" && $(All_a[1]).parent().next().remove();
                //在最后一个页签后加一个 "span"
                $(All_a[lis-1]).parent().before('<span>...</span>');
                //从第二个页签到最后一个页签的值全部减一
                for(var i = lis-2; i >= 2; i--){
                    All_a[i].innerHTML -= 1;
                }
            }
            //倒数第二个页签的值等于page_count-1时，并且为当前页
            if(All_a[lis-3].innerHTML == page_count-2 && $(All_a[lis-3]).parent().hasClass("active")){
                //移除最后一个页签后面的 "span"
                $(All_a[lis-1]).parent().prev().remove();
                //如果第一个页签后面没有 "span" 则添加 一个 "span"
                $(All_a[1]).parent().next()[0].tagName !== "SPAN" && $(All_a[1]).parent().after('<span>...</span>');
                //从第二个页签到最后一个页签的值全部加一
                for(var i = lis-2; i >= 2; i--){
                    All_a[i].innerHTML = parseInt(All_a[i].innerHTML) +  1;
                }
            }
        }

        //更改所有li下a的值
        function changeAllValue(index, lis){
            var currentValue = parseInt($('ul.pager_custom > li').eq(index).find("a").html()); //获取当前值
            var All_a = $("ul.pager_custom > li > a");   //找到所有ul > li >a
            console.log(currentValue);

            if(currentValue + COUNT > lis-2){    //当前a的值如加上COUNT的值大于所有a值为数字的数量
                $(All_a[1]).parent().next()[0].tagName != "SPAN" && $(All_a[1]).parent().after('<span>...</span>');      //在标签1次元素后添加 "..."
                if(currentValue == page_count-1) {
                    if (All_a[lis - 2].parentElement.nextElementSibling.tagName == "SPAN") {   //如果最后一个面签后面有span标签(省略号)
                        $(All_a[lis - 2]).parent().next().remove();    //删除span
                        //如第一个页签后没有span, 则在第一个页签后加一个span
                        $(All_a[lis - 1]).parent().prev()[0].tagName != "SPAN" && $(All_a[lis - 1]).parent().before('<span>...</span>');
                    }

                    if (currentValue < page_count && All_a[lis-2].innerHTML < page_count ) {     //当前的页签必须小于page_count,并且最后一个页签的值小于page_count
                    //最后一个页签与第二页签的值全部减一
                    for (var i = lis - 2; i >= 2; i--) {
                        All_a[i].innerHTML = parseInt(All_a[i].innerHTML) + 1;
                    }
                    //如果倒数第二个页签不是当前页，则将倒数第二个页签设为当前页
                    !$(All_a[lis - 2]).parent().has(".active") && $(All_a[lis - 2]).parent().addClass("active").siblings(".active").removeClass("active");
                    }
                }

                for(var i = lis- 2, j = 0; i >= 2; i--, j++){
                    if(currentValue+COUNT <= page_count){
                    All_a[i].innerHTML = currentValue + COUNT - j;
                    if(All_a[i].innerHTML == currentValue ){$(All_a[i]).parent().addClass("active").siblings(".active").removeClass("active")}
                    }
                    else if(currentValue >= page_count-1){
                        console.log(currentValue)
                        $(All_a[currentValue-1]).parent().addClass("active").siblings(".active").removeClass("active");
                        $(All_a[lis-1]).parent().prev()[0].tagName == "SPAN" && $(All_a[lis-1]).parent().prev().remove();  //移除后面的省略号
                        return;
                    }
                    $(All_a[lis-1]).parent().prev()[0].tagName == "SPAN" && $(All_a[lis-1]).parent().prev().remove();  //移除后面的省略号
                }
            }
            else{
                $('ul.pager_custom > li').eq(index).addClass("active").siblings(".active").removeClass("active");
                for(var i = 2; i < lis-1; i++){
                    All_a[i].innerHTML = i;
                    $(All_a[1]).parent().next()[0].tagName == "SPAN" ? $(All_a[1]).parent().next().remove() : "";
                }
                $(All_a[lis-1]).parent().prev()[0].tagName != "SPAN" && $(All_a[lis-1]).parent().before('<span>...</span>');      //在标签1次元素后添加 "..."
            }
        }
    }

    //localStorage.products保存用户输入的数据
    $scope.saveInputProductInfo = function(inputVal){
        var localSave = localStorage.products ? JSON.parse(localStorage.products):"";
        !localSave && (localSave = {});  //如果localStorage.products存在，则取出当前值，否则为空
        if(!localSave.productName || localSave.productName.length<9){
            //输入的值需为有效字符串，输入的值在productName数组中不存在,就将输入的值保存到数组中去
            if(!localSave.productName){   //如localSave.productName不存在
                localSave.productName = [];    //创建localSave.productName = [];
                localSave.productName.push(inputVal.productName)   //将当前的输入值productName存入localSave.productName中
            }
            //console.log(Boolean($scope.productName), $.inArray($scope.productName, localSave.productName) < 0);
            localSave.productName && $.inArray(inputVal.productName,localSave.productName) < 0 && localSave.productName.push(inputVal.productName);
            //console.log(localSave.productName);
        }
        if(!localSave.channelNum || localSave.channelNum.length<8){
            if(!localSave.channelNum){
                localSave.channelNum = [];
                localSave.channelNum.push(inputVal.channelNum);
            }
            localSave.channelNum && $.inArray(inputVal.channelNum,localSave.channelNum) < 0 && localSave.channelNum.push(inputVal.channelNum);
        }
        if(!localSave.company || localSave.company.length<8){
            if(!localSave.company){
                localSave.company = [];
                localSave.company.push(inputVal.company);
            }
            localSave.company && $.inArray(inputVal.company,localSave.company) < 0 && localSave.company.push(inputVal.company);
        }
        if(!localSave.compAbbreviation || localSave.compAbbreviation.length<8){
            if(!localSave.compAbbreviation){
                localSave.compAbbreviation = [];
                localSave.compAbbreviation.push(inputVal.compAbbreviation);
            }
            localSave.compAbbreviation && $.inArray(inputVal.compAbbreviation,localSave.compAbbreviation) < 0 && localSave.compAbbreviation.push(inputVal.compAbbreviation);
        }
        if(!localSave.adPlatform || localSave.adPlatform.length<8){
            if(!localSave.adPlatform){
                localSave.adPlatform = [];
                localSave.adPlatform.push(inputVal.adPlatform);
            }
            localSave.adPlatform && $.inArray(inputVal.adPlatform,localSave.adPlatform) < 0 && localSave.adPlatform.push(inputVal.adPlatform);
        }
        if(!localSave.adID || localSave.adID.length<8){
            if(!localSave.adID){
                localSave.adID = [];
                localSave.adID.push(inputVal.adID);
            }
            localSave.adID && $.inArray(inputVal.adID,localSave.adID) < 0 && localSave.adID.push(inputVal.adID);
        }
        localStorage.products= JSON.stringify(localSave); //保存用户数据
    }


    /* 根据一个字符串，对应的同名变量赋值*/
    $scope.selectValue = function(str,val) {
        switch(str){
            case "productName": $rootScope.productName = $scope.productName = val; break;
            case "channelNum": $rootScope.channelNum = $scope.channelNum = val; break;
            case "company": $rootScope.company = $scope.company = val; break;
            case "compAbbreviation": $rootScope.compAbbreviation = $scope.compAbbreviation = val; break;
            case "adPlatform": $rootScope.adPlatform = $scope.adPlatform = val; break;
            case "adID": $rootScope.adID = $scope.adID = val;
        }
    }

    /* 搜索时键盘事件*/
    $scope.keyEvent = function(){
        /***  失去焦点时搜索内容隐藏 ***/
        var inputs = $("div.input input.regInput");
        //var arrowCount = 0;                //用于计算按向上与向下按键的次数
        inputs.on("blur",function(){
            var me = this;
            var timer = $timeout(function(){    //用定时解决不同步问题(点击搜索li中的值，会先解发blur事件，导致无法选择
                me.nextElementSibling && (me.nextElementSibling.style.zIndex = -1);
            },300);
        }).on("keydown",function(e){
            if(e.keyCode == "9"){return;}  //如果为Tab键，则什么也不做
            //生成搜索内容，并为搜索内容添加click事件
            var $ul = $(this).next();
            $ul.css("z-index") == -1 && $ul.css("z-index",1);
            //localStorage.products为真时(products保存用户输入的数据)
            if(localStorage.products) {
                var html = ""; //清空html
                var inputVal = this.getAttribute("ng-model");   //获取当前input框要输入值的类型
                var me = this;   //留住this
                //获取用户在input框中输入的数据
                $scope.$watch(inputVal,function(){
                    var proInfo = JSON.parse(localStorage.products);   //读取localStorage.products中的数据,并转换为json格式
                    var data = proInfo[inputVal];      //读取用户对应输入的数组
                    for (var key in data) {
                        //向ul中添加一条li
                        html += "<li>" + data[key] + "</li>";
                    }
                    //!me.value && (html = "");   //防止无输入时出现自动匹配
                    $(me).next().html(html).show();     //将所有匹配的追加到ul中,让ul显示
                    $(me).next().children().on("click", function (e) {  //为ul下的li添加click事件
                        me.value = this.innerHTML;
                        var name = me.getAttribute("ng-model");
                        $scope.selectValue(name, this.innerHTML);
                        $(this).parent().hide();
                        $scope.$apply();
                        $("ul.autoAppend").html("");  //再清空ul
                    });
                });
            }
            //进行按键选择
            var lis = $(this).next().find("li");
            var curLiIndex = $(this).next().children(".hover").index();  //找到搜索中带.hover类的li的index
            //console.log(curLiIndex);
            switch(e.keyCode){
                case 37: break;
                case 38:        //upArrow key
                    curLiIndex == -1 ? curLiIndex = 0 : curLiIndex == 0 ? curLiIndex = lis.length-1 : curLiIndex--;
                    lis.eq(curLiIndex).addClass("hover").siblings(".hover").removeClass("hover");
                    lis.eq(curLiIndex).html() && (this.value = lis.eq(curLiIndex).html());      //输入框的值等于搜索选择中的内容
                    break;
                case 39: break;
                case 40:     //downArrow key
                    //curLiIndex值为-1或curLiIndex等于lis的总个数-1,则让curLiIndex为0,否则curLiIndex ++，
                    curLiIndex == -1 || curLiIndex == lis.length-1 ? curLiIndex = 0 : curLiIndex ++ ;
                    console.log(curLiIndex);
                    lis.eq(curLiIndex).addClass("hover").siblings(".hover").removeClass("hover");    //给第i个li添加一个.hover类,其它包含.hover的移除.hover类
                    lis.eq(curLiIndex).html() && (this.value = lis.eq(curLiIndex).html());      //输入框的值等于搜索选择中的内容
                    break;
                case 13:
                    e.preventDefault() || e.preventBubble;  //阻止editBack02.html页面新增用户的输入，进入保存按钮
                    var curli = $(this).next().find("li.hover");   //找到当前的li
                    //this.value = curli.html();
                    var name = this.getAttribute("ng-model");
                    $scope.selectValue(name, curli.html());
                    $scope.$apply();
                    $("ul.autoAppend").html("");  //再清空ul
            }
        });
    }

    //如果广告ID为0时，则改为空 (2016-11-15);
    $scope.changeAdId = function(data, key){
        if(!data || arguments.length == 1)return;
        $.each(data,function(){
            this[key] == 0 && (this[key]= "");
        });
        return data;
    }


}]).controller("login",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    $scope.show = true;
    if(localStorage.uname){ checkAuto(); }
    $scope.verification = function(){
        //console.log($scope.uname,$scope.pwd,$scope.select);
        $http.get("data/verificationUserPwd.php?uname="+$scope.uname+"&pwd="+$scope.encipher($scope.pwd)).success(function(data){
            if(data != "login succ!"){
                $scope.show = false;
            }
            else{
                if($scope.select == true){
                    saveUserPwd($scope.uname, $scope.pwd);
                }
                $("#login-container").hide(500);
                $rootScope.uname = $scope.uname;

                if($scope.uname !="apy"){
                    $("#self_company").hide();
                    $("#other_user").show();
                    $http.get("data/getProducts_pager.php?name="+$rootScope.uname + "&pno=1").success(function(data){
                        $scope.arrSort(data['data']['products'],"effectiveDate");
                        //$scope.products = data['data']['products'];
                        $scope.products = $scope.changeAdId(data['data']['products'],"adID");
                        $rootScope.products = $scope.products;
                        data['page_count'] > 1 && $scope.createBtn(data,1);
                        $scope.pagerClick();     //为分页添加点击效果
                    });

                    //获取安装量
                    $http.get("data/getProducts.php?name="+$rootScope.uname).success(function(data){
                        $rootScope.total = $scope.getInstallTotal(data);
                    });

                    $("#addEdit").css("display","none");
                }
                else{
                    $http.get("data/getAllProducts_pager.php?pno=1").success(function(data){
                        $scope.arrSort(data['data']['products'],"effectiveDate");
                        data['data']['products'] = $scope.changeEffeDate(data['data']['products']);
                        //$scope.products = data['data']['products'];
                        $scope.products = $scope.changeAdId(data['data']['products'],"adID");
                        $rootScope.products = $scope.products;
                        $rootScope.total = $scope.getInstallTotal($scope.products);
                        //clone对象$scope.proudcts赋值给$rootScope.oldProducts
                        for(var i=0; i< $scope.products.length; i++){
                            $rootScope.oldProducts[i] = {};
                            for(var key in $scope.products[i]){
                                $rootScope.oldProducts[i][key] = $scope.products[i][key];
                            }
                        }

                        data['page_count'] > 1 && $scope.createBtn(data,1); //如果只有一页，则不分页显示
                        $scope.pagerClick();     //为分页添加点击效果

                        //获取总安装量
                        $http.get("data/getAllProducts.php").success(function(data){
                            $rootScope.total = $scope.getInstallTotal(data);
                        });
                    });
                }
            }
        });
    };

    //本地储存uname,pwd,loginTime
    function saveUserPwd(uname,pwd){
        window.localStorage.uname=uname;
        window.localStorage.pwd = $scope.encipher(pwd);
        window.localStorage.loginTime = new Date().getTime();
    }
    //用于检查自动登录
    function checkAuto(){
        var  uname = localStorage.uname;
        var pwd = $scope.decipher(localStorage.pwd);
        var loginTime = localStorage.loginTime;

        var now = new Date().getTime();
        if((now - loginTime) > 1000 * 3600 *24*7)
        {
            localStorage.removeItem("uname");
            localStorage.removeItem("pwd");
        }
        else
        {
            $scope.uname=uname;
            $scope.pwd = pwd;
        }
    }

}]).controller("changePwd",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
    $scope.pwdAlert = true;  //用于控制新密码的提示
    $scope.oldPwdAlert="hidden"; //用于控制旧密码的输入正确于否
    var oldPwd = true;  //判断旧的密码输入是否正确
    $scope.$watch("uname",function(){
        //console.log($scope.uname);
    });
    //用于检查当前登录时的密码是否正确
        $scope.verificationOldPwd = function () {
            if($scope.pwd){
                $http.get("data/verificationUserPwd.php?uname=" + $scope.uname + "&pwd=" + $scope.encipher($scope.pwd)).success(function (data) {
                    //console.log(data);
                    if (data != "login succ!") {
                        $scope.oldPwdAlert = "visible";
                        oldPwd = false;
                    }
                    else{
                        $scope.oldPwdAlert="hidden";
                    }
                });
            }
    }

    //用于检查两次新输入的密码是否一致
    $scope.checkIpntPwd = function(){
        if($scope.firstPwd != $scope.secondPwd){   //第一次与第二次输入的密码一致时
            $scope.pwdAlert = false;
        }
        else if($scope.firstPwd.length >= 6 && oldPwd){ //新密码长必须>=6 && 原始密码输入正确时
            $http.get("data/changePwd.php?uname="+$scope.uname + "&pwd=" + $scope.encipher($scope.secondPwd)).success(function(data){
                //console.log(data);
                //$scope.isShow=false;//关闭修改密码框
            });
            $("#changePwd").hide(500);
            $scope.clearAllPwd();
        }
    }

    //清除所有密码
    $scope.clearAllPwd = function(){
        $scope.pwd = "";
        $scope.firstPwd = "";
        $scope.secondPwd = "";
    }
}]).controller("editContent",["$scope","$rootScope","$http",function($scope, $rootScope, $http){
    $scope.isShow = "hidden";

    $scope.firstInsertIndex = [];  //用于保存新增加数据的下标
    $scope.newAddData = [];

    $scope.save = function(){
        var prodInfo = {};      //用于保存新增加的一行数据
        console.log($scope.cooperateType);
        cooperateChange();
        if($scope.productName && $scope.channelNum && $scope.company && $scope.compAbbreviation && $scope.cooperateType
            && $scope.price && $scope.effectiveDate && $scope.endDate){   //用于检查用户否漏输入
            if(($scope.effectiveDate.getTime()+1000*3600*24*365) <= $scope.endDate.getTime() && /\d/g.test(parseInt($scope.price))) { //用于检查用户输入格式是否正确
                $http.get("data/insertData02.php?proName=" + $scope.productName + "&channelName=" + $scope.channelNum + "&company="
                    + $scope.company + "&compabbr=" + $scope.compAbbreviation + "&coopType=" + $scope.cooperateType + "&price=" + $scope.price +
                    "&effeDate=" + $scope.effectiveDate.getTime() + "&endDate=" + $scope.endDate.getTime()).success(function (data) {
                    console.log(data);
                    if (data.msg == "Insert Succ!") {
                        $scope.isShow = "visible";
                        $scope.insertMsg = "输入成功!!!";
                        $scope.firstInsertIndex.push(data.did);

                        $http.get("data/returnNewAdd.php?did="+data.did).success(function(data){
                            console.log(data);
                            $scope.newAddData.push(data);
                            $scope.products = $scope.newAddData;
                        });
                    }
                    else {
                        $scope.isShow = "visible";
                        $scope.insertMsg = "输入有误!!!";
                    }
                })
            }
            else{
                $scope.isShow = "visible";
                $scope.insertMsg = "输入有误或格式不对!!";
            }
        }
    }
    $scope.close=function(){
        $("#editContent").hide(500);
    }
    //转换对应的文字
    function cooperateChange(){
        switch($scope.cooperateType){
            case "0":$scope.cooperateType = "CPA";break;
            case "1":$scope.cooperateType = "CPC";break;
            case "2":$scope.cooperateType = "CPI";break;
            case "3":$scope.cooperateType = "CPT";break;
        }
    }
    //endDate默认值的设置
    function endDateDefau(){
        var date = new Date()
        date.setFullYear(date.getFullYear()+1);
        $scope.endDate = date
    }
    endDateDefau();

}]).controller("editBack",["$scope","$rootScope","$http","$timeout",function($scope,$rootScope,$http,$timeout){  //新增用户输入控制器
    var products = {};  //用于保存用户输入的数据，最后再存储到localStorage.products中
    products.productName=[];
    products.channelNum = [];
    products.company = [];
    products.compAbbreviation = [];

    var $s = $scope;
    $s.isVisi = "hidden";
    $s.dateShow = "hidden";
    $s.close = function(){
        $("#inputProductInfo").hide(500);
        //console.log($scope.index);
        clearOldInputData();
        $scope.clearSearchHistroy();
    }
    $s.verifiedDate = function(){ //验证生效时期
        var date = new Date($s.effectiveDate);
        if($s.effectiveDate){
            $s.endDate = $s.effectiveDate;
            $s.endDate.setFullYear($s.effectiveDate.getFullYear()+1);
        }
        //$s.effectiveDate = date.toLocaleDateString().replace(/\//g,"-");
        $s.isVisi='hidden';
    }

    $s.checkDate = function(){
        var date = new Date($s.effectiveDate);
        var endDate = new Date($s.endDate);
        $s.effectiveDate && ($s.effectiveDate = date.getTime()); //year-moth-date转换成毫秒数
        $s.endDate && ($s.endDate = endDate.getTime());
        $s.isVisi = "hidden";
        if(endDate.getTime() < (date.getTime()+1000*3600*24*365)){
            console.log(endDate.getTime());
            $s.dateShow = "visible";
            $s.dateMsg = "结束日期必须大于生效日期+1年";
        }
        else{
            $s.dateShow = "hidden";
            $s.dateMsg = "";
        }
        $s.effectiveDate = date.toLocaleDateString().replace(/\//g,"-");
        $s.endDate = endDate.toLocaleDateString().replace(/\//g,"-");
    }

    //检验数据格式(price & install)
    var priceMsg = false;
    $s.veriPrice = "hidden";
    $s.verifiedPrice = function(){
        if($s.price){
            priceMsg = /^^(\d)*(.)?(\d)*$/.test($s.price);
            if(!priceMsg){$s.veriPrice = "visible"; $s.priceAlert = "单价必须为数字!!";}
            else{ $s.veriPrice="hidden"; $s.priceAlert = "";}
        }
        //console.log(priceMsg);
    }

    var isntallMsg = false;
    $s.verifiedInstall = function(){
        if($s.installCount){
            installMsg = /^(\d)*$/.test($s.installCount);
            if(!installMsg){ $s.isVisi = "visible"; $s.isSucc = "安装量必须为数字或整数";}
            else{$s.isVisi = "hidden";$s.isSucc = "";}
        }
    }


    $scope.firstInsertIndex = [];  //用于保存新增加数据的下标
    $scope.newAddData = [];

    var oldProducts = [];    //保存现有的数据

    $s.save = function(){
        var prodInfo = {};      //用于保存新增加的一行数据
        cooperateChange();

        //与mainCtrl数据同步(下面四个变量在mainCtrl赋值)
        /*
        $s.productName = $rootScope.productName;
        $s.channelNum = $rootScope.channelNum;
        $s.company = $rootScope.company;
        $s.compAbbreviation = $rootScope.compAbbreviation;
        $s.adPlatform = $rootScope.adPlatform;
        $s.adID = $rootScope.adID;
        */

        if($scope.productName && $scope.channelNum && $scope.company && $scope.compAbbreviation && $scope.cooperateType
            && priceMsg && installMsg && $s.effectiveDate && $s.adPlatform && $s.adID){   //用于检查用户否漏输入  //&& $s.endDate
            //if(($scope.effectiveDate.getTime()+1000*3600*24*365) <= $scope.endDate.getTime()) { //用于检查用户输入格式是否正确
                var param = "adPlatform=" + $s.adPlatform + "&adID=" + $s.adID + "&proName=" + $s.productName + "&channelName=" +
                    $s.channelNum + "&company=" + $s.company + "&compabbr=" + $s.compAbbreviation + "&coopType=" + $s.cooperateType
                    + "&price=" + $s.price + "&installCount=" + $s.installCount + "&effeDate=" + $s.effectiveDate.getTime() +
                    "&endDate=" + $s.endDate.getTime();

                $http.get("data/insertDataAll.php?" + param).success(function (data) {
                    if (data.msg == "Insert Succ!") {
                        $s.isVisi = "visible";
                        $scope.isSucc = "输入成功!!!";
                        $scope.firstInsertIndex.push(data.did);

                        $http.get("data/returnNewAdd.php?did="+data.did).success(function(data){
                            $scope.newAddData.push(data);
                            $scope.arrSort($scope.newAddData,"effectiveDate");
                            $scope.products = $scope.newAddData;
                            oldProducts.concat($scope.newAddData);
                            oldProducts.push(data);
                        });

                        var inputVal = {productName:$s.productName, channelNum:$s.channelNum, company:$s.company, compAbbreviation:$s.compAbbreviation }
                        $scope.saveInputProductInfo(inputVal); //将用户保存的数据存储到localStorage中
                    }
                    else {
                        $scope.isVisi = "visible";
                        $scope.isSucc = "输入有误!!!";
                    }
                })
        }
        else{
            console.log($scope.productName,$scope.channelNum,$scope.company,$scope.compAbbreviation,$scope.cooperateType
                , priceMsg, installMsg,$s.effectiveDate, $s.adPlatform, $s.adID);
            $scope.isVisi = "visible";
            $scope.isSucc = "漏输入或输入有误或格式不对!!";
        }
        $scope.clearSearchHistroy();
        /*
        console.log($s.productName,$rootScope.productName);
        console.log($s.channelNum, $rootScope.channelNum);
        console.log($s.company, $rootScope.company);
        console.log($s.compAbbreviation, $rootScope.compAbbreviation);
        console.log($s.adPlatform, $rootScope.adPlatform);
        console.log($s.adID, $rootScope.adID);
        */
    }

    function clearOldInputData(){
        $scope.productName='';
        $scope.channelNum = '';
        $scope.company = '';
        $scope.compAbbreviation = '';
        $scope.price = '';
        $scope.installCount = '';
    }

    /*  点击新增输入框，让下拉搜索框隐藏并清空内容 */
    document.querySelector("#inputProductInfo").addEventListener("click",function(e){
        $("#eidtBack-form input.regInput").next().hide().html("");
        $("#eidtBack-form  input.regInput").each(function(i,elem){
            //让数据同步
            if(elem.value){$scope.selectValue(elem.getAttribute("ng-model"),elem.value);}
        })
    });


    $s.keyEvent(); //调用搜索键盘事件

    //生效日期的默认值
    function effectiveDate(){
        $s.effectiveDate = new Date();
    }

    effectiveDate();

    //endDate默认值的设置
    function endDateDefau(){
        var date = new Date()
        date.setFullYear(date.getFullYear()+1);
        $s.endDate = date
    }
    endDateDefau();

    //当前时间再加上一年
    function nowAddOneYear(str){
        var now = new Date(str);
        var finalDate = now.setFullYear(now.getFullYear()+1);//返回的是一个毫秒数
        return finalDate;
    }

    //转换对应的文字
    function cooperateChange(){
        switch($scope.cooperateType){
            case "0":$scope.cooperateType = "CPA";break;
            case "1":$scope.cooperateType = "CPC";break;
            case "2":$scope.cooperateType = "CPI";break;
            case "3":$scope.cooperateType = "CPT";break;
        }
    }

}]).controller("editData",["$scope","$rootScope","$http","$timeout",function($scope,$rootScope,$http,$timeout){
    var oldProducts = [];    //保存现有的数据
    var path = location.href;
    //防止查找不到"?"时,index从0开始
    path.lastIndexOf("?") >=0 && ($scope.uname = path.substring(location.href.lastIndexOf("?")+1));
    $scope.editable = true; //安装量是否可编辑
    $scope.autoComplete = "off";  //获取焦点
    //根椐用户类型对应加载数据
    if($scope.uname !="apy"){
        console.log($scope.uname);
        $http.get("data/getProducts.php?name="+$rootScope.uname).success(function(data){
            $scope.arrSort(data,"effectiveDate");
            //$scope.products = data;
            $scope.products = $scope.changeAdId(data,"adID");
            $rootScope.products = $scope.products;
        });
    }
    else{
        $http.get("data/getAllProducts.php").success(function(data){
            var data = removeObjArrRepeat(data);
            $scope.arrSort(data,"effectiveDate");
            //$scope.products = data;
            $scope.products = $scope.changeAdId(data,"adID");
            $rootScope.products = $scope.products;
            oldProducts = $scope.products;
        });

    }

    //去重复
    function removeObjArrRepeat(objArr){
        //新数组用于保存去重复后的数据
        var newObjArr = [objArr[0]];
        //遍历objArr
        for(var i = 1; i < objArr.length; i++){
            //遍历newObjArr
            for(var j = 0; j < newObjArr.length; j++){
                //如果objArr.company == newObjArr[j].company(用company作参照)
                if(objArr[i].company == newObjArr[j].company){
                    //如果objArr[i].effectiveDate大于newObjArr[j].effectiveDate,就让newObjArr[j] 等于 objArr[i]
                    parseInt(objArr[i].effectiveDate) > parseInt(newObjArr[j].effectiveDate) && (newObjArr[j] = objArr[i]);
                    //退出循环
                    break;
                }
            }
            //如查newObjArr遍历结束(没有重复数据),newObjArr压入objArr[i];
            if(j == newObjArr.length) {newObjArr.push(objArr[i]);}
        }
        return newObjArr;
    }

    //保存用户编辑的数据
    loadData();

    //点击变为可编辑状态
    $scope.changeDis = function(){
        $scope.editable=false;
        $scope.autocomplete = "on";
    }

    //刷新页面，重新加载数据
    $scope.refresh = function(){
        $scope.clearSearchHistroy();  //清除之前的搜索记录
        loadData();
    }

    function loadData(){
        if($scope.uname !="apy"){
            console.log($scope.uname);
            $http.get("data/getProducts.php?name="+$rootScope.uname).success(function(data){
                $rootScope.arrSort(data,"effectiveDate");
                $scope.products = $scope.changeAdId(data,"adID");
                $rootScope.products = $scope.products;
            });
        }
        else{
            $http.get("data/getAllProducts.php").success(function(data){
                var data = removeObjArrRepeat(data);
                $scope.arrSort(data,"effectiveDate");

                $scope.products = $scope.changeAdId(data,"adID");
                $rootScope.products = $scope.products;
            });
        }
    }

    //搜索
    var jsonCount = {}
    $('#table-data').on('click', '[sort-by]', function(e) {
        var sSortBy = $(this).attr('sort-by')
        // $scope.products
        jsonCount[sSortBy] = jsonCount[sSortBy] || 0
        jsonCount[sSortBy]++
        var isDesc = jsonCount[sSortBy] % 2
        $scope.products.sort(function(a0, a1) {
            //installCount price
            if (sSortBy == 'installCount' || sSortBy == 'price') {
                // 按照数字排序
                return isDesc ? a0[sSortBy] - a1[sSortBy] : a1[sSortBy] - a0[sSortBy]
            } else {
                // 自然序
                return isDesc ? a0[sSortBy].localeCompare(a1[sSortBy]) : a1[sSortBy].localeCompare(a0[sSortBy])
            }
        })
        $scope.$apply()
    })


    /******** 查询 ************/
    $scope.searchData = function(){
        if ($scope.productName || $scope.channelNum || $scope.company || $scope.cooperateType) {
            undefineChangeNull();
            console.log($scope.productName);
            var params = "productName=" + $scope.productName + "&channelNum=" + $scope.channelNum +
                "&company=" + $scope.company + "&cooperateType=" + $scope.cooperateType;
            $http.get("data/newSelectData.php?" + params).success(function (data) {
                console.log(data);
                $scope.products = data;
                $scope.total = $scope.getInstallTotal($scope.products);
                if(!data.length){
                    console.log("没查找到符合你要求的数据!!");
                    $("#selectAlert").fadeIn(500);
                }
            });
        }
    }

    function undefineChangeNull(){
        if(!$scope.productName){ $scope.productName = "";}
        if(!$scope.channelNum){ $scope.channelNum = "";}
        if(!$scope.company){ $scope.company = "";}
        if(!$scope.cooperateType){ $scope.cooperateType = "";}
    }

    //保存修改后的数据
    $scope.saveEditData = function($index){
        var reg = /\d/g;
        var adIDVerified = reg.test($scope.products[$index].adID) || $scope.products[$index].adID == "";
        if($scope.editable == false && adIDVerified && $scope.cooperateVerified && $scope.priceVerified){
            var params = $scope.products[$index].productName+ "&adID=" + $scope.products[$index].adID + "&channelNum="+$scope.products[$index].channelNum+
                "&cooperateType="+$scope.products[$index].cooperateType.toUpperCase()+"&company="+$scope.products[$index].company
                +"&price="+$scope.products[$index].price+"&did="+ $scope.products[$index].did;
        $http.get("data/saveEdit_Table.php?productName="+params).success(function(data){
                var currentTD = $("#table-data tbody tr").eq($index);
                if(data == "Update Succ!"){
                    console.log("修改成功");
                    //保存之前的背景颜色
                    var prevBackColor = currentTD.css("background");
                    currentTD.css("background","#81E3D6");
                    //5秒之后恢复之前的颜色
                    $timeout(function(){
                        currentTD.css("background",prevBackColor);
                    },5000);
                }
                else{
                    var previousColor = currentTD.css("color");
                    currentTD.css("color","#f00");
                    //5秒之后恢复之前的颜色
                    $timeout(function(){
                        currentTD.css("color",previousColor); //恢复之前的颜色
                        $scope.abandon($index);                //恢复之前的数据
                    },5000);
                }
        });
        }
    }

    //用于数据的检验
    $scope.verifiedCooperate = function(index){
        var originArr = ['CPA',"CPC","CPI","CPT"];
        if(originArr.indexOf($scope.products[index].cooperateType.toUpperCase()) < 0){
            $scope.verifiedDataMsg = "合作类型只能从:CPA,CPC,CPI,CPT中选择一种.";
            $("#verifiedData").show(500);
        }
        else{$scope.cooperateVerified = true;}
    }

    $scope.verifiedPrice = function(index){
        if(!/\d/g.test($scope.products[index].price)){
            $scope.verifiedDataMsg = "输入的数据类型不对.";
            $("#verifiedData").show(500);
        }
        else{$scope.priceVerified = true;}
    }

    //关闭数据类型不对的警告框
    $scope.closeVerifiedData = function(){
        $("#verifiedData").hide(500);
    }

    //不保存修改后的数据
    $scope.abandon = function($index){
        if(!$scope.editable){
            console.log($index)
            console.log($scope.products[$index].did);
            console.log($scope.products,oldProducts);
            console.log($scope.products.length,oldProducts.length);
            var did = $scope.products[$index].did; //找到点击对应的did;
            var index = returnIndex(did,oldProducts);    //根据did找到之前的index
            console.log(index);
            console.log(oldProducts[index].installCount);
            //将之前的数据读回去
            $scope.products[$index].installCount = oldProducts[index].installCount;
            $scope.editable = true;
        }
    }

    //根成did查找对应的index值
    function returnIndex(did,data){
        for(var i = 0; i <data.length; i++){
            console.log(data[i].did);
            if(data[i].did == did){ return i;}
        }
    }

    //找到input框的外层inputProductInfo为其添加click
    document.querySelector("#editContent").addEventListener("click",function(){
        $("input.regInput").next().hide();  //让ul隐藏
        $("#input-form  input.regInput").each(function(i,elem){
            //让数据同步
            if(elem.value){$scope.selectValue(elem.getAttribute("ng-model"),elem.value);}
        })
    });

    //新增录入数据
    $scope.isShow = "hidden";

    $scope.firstInsertIndex = [];  //用于保存新增加数据的下标
    $scope.newAddData = [];

    $scope.save = function(){
        var prodInfo = {};      //用于保存新增加的一行数据
        console.log($scope.cooperateType);
        cooperateChange();

        /*保持与mainCtrl 数据同步 */
        $scope.productName = $rootScope.productName;
        $scope.channelNum = $rootScope.channelNum;
        $scope.company = $rootScope.company;
        $scope.compAbbreviation = $rootScope.compAbbreviation;

        if(/*$scope.productName && */$scope.channelNum && $scope.company && $scope.compAbbreviation && $scope.cooperateType
            && $scope.price && $scope.effectiveDate && $scope.endDate){   //用于检查用户否漏输入
            $scope.productName = $scope.productName ? $scope.productName :  "";

            if(($scope.effectiveDate.getTime()+1000*3600*24*365) <= $scope.endDate.getTime() && /\d/g.test(parseInt($scope.price))) { //用于检查用户输入格式是否正确
                $http.get("data/insertData02.php?proName=" + $scope.productName + "&channelName=" + $scope.channelNum + "&company="
                    + $scope.company + "&compabbr=" + $scope.compAbbreviation + "&coopType=" + $scope.cooperateType + "&price=" + $scope.price +
                    "&effeDate=" + $scope.effectiveDate.getTime() + "&endDate=" + $scope.endDate.getTime()).success(function (data) {
                    console.log(data);
                    if (data.msg == "Insert Succ!") {
                        $scope.isShow = "visible";
                        $scope.insertMsg = "输入成功!!!";
                        $scope.firstInsertIndex.push(data.did);

                        $http.get("data/returnNewAdd.php?did="+data.did).success(function(data){
                            console.log(data);
                            $scope.newAddData.push(data);
                            $scope.arrSort($scope.newAddData,"effectiveDate");
                            $scope.products = $scope.newAddData;
                            oldProducts.concat($scope.newAddData);
                            oldProducts.push(data);
                            console.log(oldProducts,oldProducts.length);
                        });
                    }
                    else {
                        $scope.isShow = "visible";
                        $scope.insertMsg = "输入有误!!!";
                    }
                })
            }
            else{
                $scope.isShow = "visible";
                $scope.insertMsg = "输入有误或格式不对!!";
            }
        }
        else{
            $scope.isShow = "visible";
            $scope.insertMsg = "漏输入或输入有误或格式不对!!";
        }
        $scope.clearSearchHistroy();
    }
    $scope.close=function(){
        $("#editContent").hide(500);
        $scope.clearSearchHistroy();
    }
    //转换对应的文字
    function cooperateChange(){
        switch($scope.cooperateType){
            case "0":$scope.cooperateType = "CPA";break;
            case "1":$scope.cooperateType = "CPC";break;
            case "2":$scope.cooperateType = "CPI";break;
            case "3":$scope.cooperateType = "CPT";break;
        }
    }

    //生效日期的默认值
    function effectiveDate(){
        $scope.effectiveDate = new Date();
    }

    effectiveDate();

    //endDate默认值的设置
    function endDateDefau(){
        var date = new Date()
        date.setFullYear(date.getFullYear()+1);
        $scope.endDate = date
    }
    endDateDefau();

    //清除历史搜索记录
    $scope.clearSearchHistroy=function(){
        $scope.productName="";
        $scope.channelNum = "";
        $scope.cooperateType = "";
        $scope.company = "";
        $scope.compAbbreviation = "";
        $scope.price="";
        //$scope.effectiveDate = "";
        //$scope.endDate = "";
    }

    $scope.keyEvent(); //调用搜索键盘事件


}]).controller("resetPwd",["$scope","$http",function($scope,$http){   //重置用户密码
    $scope.pwdAlert = true;  //用于控制新密码的提示
    $scope.isUser = "hidden";
    $scope.resetSucc = "hidden";
    $scope.$watch("uname",function(){
        //console.log($scope.uname);
    });

    $scope.close = function(){
        $("#resetPwd").hide(500);
    }

    //检查用户是否存在
    $scope.checkIsUser = function(){
        var reg = /^[a-zA-Z0-9]+?/;
        console.log(reg.test($scope.uname));
        if(reg.test($scope.uname)){
            console.log($scope.uname);
            $http.get("data/checkIsUser.php?uname="+$scope.uname).success(function(data){
                console.log(data);
                if(data == "user is being"){ $scope.isUser="hidden"; $scope.isUserMsg = "";}
                else{$scope.isUser="visible"; $scope.isUserMsg = "该用户不存在!!请重新输入";}
            });
        } else{
            $scope.isUser = "visible";
            $scope.isUserMsg ="用户名不能包含汉字";
        }
    }

    //用于检查两次新输入的密码是否一致
    $scope.checkIpntPwd = function(){
        console.log($scope.isUserMsg);
        if($scope.firstPwd != $scope.secondPwd){   //第一次与第二次输入的密码一致时
            $scope.pwdAlert = false;
        }
        else if($scope.firstPwd.length >= 6 && $scope.isUserMsg == ""){ //新密码长必须>=6
            $http.get("data/changePwd.php?uname="+$scope.uname + "&pwd=" + $scope.encipher($scope.secondPwd)).success(function(data){
                //console.log(data);
                //$scope.isShow=false;//关闭修改密码框
            });
            //$("#resetPwd").hide(500);
            $scope.resetSucc = "visible";
            $scope.resetSuccess = "密码更改成功!!!"
            $scope.clearAllPwd();
        }
    }

    //清除密码更改成功的字本
    $scope.changeResetmsg = function(){
        $scope.resetSuccess = "";
    }

    //清除所有密码
    $scope.clearAllPwd = function(){
        $scope.firstPwd = "";
        $scope.secondPwd = "";
    }
}]);