/*Created 2015-07-31  by Rajbir Karan Singh*/

function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
       if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
       }
       if (start <= today){
         if (val.end_date){
             end = new Date (val.end_date);
             end.setDate(end.getDate() + 1);
             if (end >= today){
               item_list.push(val);  
             }
             
         } else {
             item_list.push(val);
         }
       
        
       }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
       
    });
    $(home_banner).html(item_rendered.join(''));
    
}

function renderStoreList(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                val.alt_store_front_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
            
        }
        //var categories = getStoreCategories();
        var current_initial = val.name[0];
        val.categories_list = val.category_list = getCategoriesNamesByStoreSlug(val.slug);
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        }
        else{
            val.initial = current_initial;
            store_initial = current_initial;
            if (val.initial == "A"){
                val.show = "display:inline-block;margin-top:24px";
            }
            else{
                val.show = "display:inline-block;";
            }
        }
        if (val.promotions.length > 0){
            val.promotion_exist = "visibility:show";
        }
        else{
            val.promotion_exist = "visibility:hidden";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        val.category_list = getCategoriesNamesByStoreSlug(slug);
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        val.property_map = getPropertyDetails().mm_host + getPropertyDetails().map_url;
        // renderStoreExtras($('#jobs_container'), $('#jobs_template'), "jobs", val.jobs);
        
        if (val.website.length > 0){
            val.show = "display:inline-block";
        }
        else{
            val.show = "display:none";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    
    $(container).html(item_rendered.join(''));
    $(".modal-backdrop").remove();
}

function renderStoreExtras(container, template, type, ids){
    if (ids.length > 0 && type == "promos") {
        $('#promotion_extra').show();
    }
    if (ids.length > 0 && type == "jobs") {
        $('#employment_extra').show();
    }
    if (type == "promos"){
        var collection = getPromotionsForIds(ids);
    }
    else if (type =="jobs"){
        var collection = getJobsForIds(ids)
    }
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        start.setDate(start.getDate()+1);
        end.setDate(end.getDate()+1);
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        val.closing_date = get_month(end.getMonth()) + " " + end.getDate() + ", " + end.getFullYear();
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    }) ;
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                case 0:
                    val.day = "Sunday";
                    break;
                case 1:
                    val.day = "Monday";
                    break;
                case 2:
                    val.day = "Tuesday";
                    break;
                case 3:
                    val.day = "Wednesday";
                    break;
                case 4:
                    val.day = "Thursday";
                    break;
                case 5:
                    val.day = "Friday";
                    break;
                case 6:
                    val.day = "Saturday";
                    break;
                
            }
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = new Date (val.open_time);
                var close_time = new Date (val.close_time);
                val.open_time = convert_hour(open_time);
                val.close_time = convert_hour(close_time);    
                val.h = val.open_time+ " - " + val.close_time;
            } else {
                "Closed";
            }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = new Date (val.holiday_date);
                holiday.setDate(holiday.getDate()+1);
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = get_month(holiday.getMonth()) + " " +holiday.getDate();
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = new Date (val.open_time);
                    var close_time = new Date (val.close_time);
                    val.open_time = convert_hour(open_time);
                    val.close_time = convert_hour(close_time);    
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = val.open_time+ " - " + val.close_time;
                } else {
                    val.h = "Closed";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
};

function renderGeneral(container, template, collection, type){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if (type == "promos"){
            if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                        val.alt_promo_image_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
                        val.store_image = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
                    } else {
                        val.alt_promo_image_url = (store_details.store_front_url_abs); 
                        val.store_image = store_details.store_front_url_abs;
                    }
                    
                    val.store_name = store_details.name;
                } else {
                    val.alt_promo_image_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
                }
                
            } else {
                val.alt_promo_image_url = (val.promo_image_url_abs);
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug;
                    val.store_name = store_details.name;
                    val.store_image = store_details.store_front_url_abs;
                }
        
            }
            
            
            start = new Date (val.start_date);
            end = new Date (val.end_date);
            start.setDate(start.getDate()+1);
            end.setDate(end.getDate()+1);
        
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
            
        }
        if(type == "jobs"){
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.jobable_type == "Store") {
                var store_details = getStoreDetailsByID(val.jobable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs);    
                }
                val.store_name = store_details.name;
                val.store_slug = store_details.slug;
            }
            else{
                val.store_name = "Scarborough Town Centre";
            }
            start = new Date (val.start_date);
            end = new Date (val.end_date);
            start.setDate(start.getDate()+1);
            end.setDate(end.getDate()+1);
            val.closing_date = get_month(end.getMonth()) + " " + end.getDate() + ", " + end.getFullYear();
            if (val.contact_name == ""){
                val.contact_name = "N/A" ;               
            }
            if (val.contact_email == ""){
                val.contact_email = "N/A";              
            }
        }
        if(type=="events"){
            start = new Date (val.start_date);
            end = new Date (val.end_date);
            start.setDate(start.getDate()+1);
            end.setDate(end.getDate()+1);
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderPromosEvents(container, template, collection){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if (val.type=="promotions"){
            val.image_url = val.promo_image_url_abs;
        }
        if (val.type=="events"){
            val.image_url = val.event_image_url_abs;
        }
        if ((val.image_url).indexOf('missing.png') > -1) {
            val.image_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
        }
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        start.setDate(start.getDate()+1);
        end.setDate(end.getDate()+1);
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderPromoDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.promo_image_url).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.alt_promo_image_url = getImageURL(store_details.store_front_url);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                
            } else {
                val.alt_promo_image_url = "http://assets.kodekloud.io/sites/55bba30d6e6f64157e000000/24ac5b317a383812fad7eab38651125a/mp_logo_2.png";
            }
            
        } else {
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                
            }
            val.alt_promo_image_url = getImageURL(val.promo_image_url);
            
        }
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        start.setDate(start.getDate()+1);
        end.setDate(end.getDate()+1);
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}









