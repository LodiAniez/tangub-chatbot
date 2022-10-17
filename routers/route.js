var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: false});
var validator = require('express-validator');
var mysql = require('mysql');
var fs = require('fs');
const url = require('url');
const { hashSync, genSaltSync } = require("bcrypt");

var connection = mysql.createConnection({
    connectionLimit: 100,
    host: 'mysql0.serv00.com',
    user: 'm1007_tangub',
    password: 'Access30Granted',
    database: 'm1007_nmscstchatbot'
});

module.exports = function (app) {

    function isUserAllowed(req, res, next) {
        sess = req.session;
        if (sess.user) {
            return next();
        } else {
            res.redirect('/login');
        }
    }


    app.get('/', isUserAllowed, function (req, res) {
        res.locals = {title: 'Dashboard'};
         res.render('Dashboard/index');
       
    });


    app.get('/students', isUserAllowed, function (req, res) {
        res.locals = {title: 'Students'};
        //res.render('Students/students');
        var sql = "SELECT * FROM students";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('Students/students', {title: 'Students', userData: data});

        });
     
    });


    app.get('/grades', isUserAllowed, function (req, res) {
        res.locals = {title: 'Grades'};
        res.render('Form/grades');
    });

    app.get('/events', isUserAllowed, function (req, res) {
        res.locals = {title: 'Events'};
        //  res.render('Form/events');


        var sql = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as formatted_date,date_format(eventtime, '%l:%i %p') as formatted_eventtime,adminID  FROM events ";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;


            //  studentRows= JSON.parse(JSON.stringify(data));
            // filepath=studentRows[0].fileupload;

            res.render('Form/events', {title: 'Events', userData: data});
            // res.render('Tables/prospectus');

            // res.render('Tables/prospectus');

        });


    });
  
  //events-edit sample
     app.get('/events-edit', isUserAllowed, function (req, res) {
        res.locals = {title: 'Events'};
        //  res.render('Form/events');


        var sql = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as formatted_date,date_format(eventtime, '%l:%i %p') as formatted_eventtime,adminID  FROM events ";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('Form/events-edit', {title: 'Update Events', userData: data});

        });


    });
  
  
  
    //SMS SELECT
    app.get('/sms', isUserAllowed, function (req, res) {
        res.locals = {title: 'SMS'};
        //  res.render('Form/sms');


        var sql = "SELECT *  FROM conversation where channel='SMS'";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;


            //  studentRows= JSON.parse(JSON.stringify(data));
            // filepath=studentRows[0].fileupload;

            res.render('Form/sms', {title: 'SMS', userData: data});
            // res.render('Tables/prospectus');


            // res.render('Tables/prospectus');

        });


    });
  
      app.get('/unhandle', isUserAllowed, function (req, res) {
        res.locals = {title: 'Unnhandle Queries'};
        //  res.render('Form/sms');


        var sql = "SELECT *  FROM unhandledqueries";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('Form/unhandle', {title: 'Unhandle Queries', userData: data});

        });


    });

    app.get('/prospectus', isUserAllowed, function (req, res) {
        res.locals = {title: 'Prospectus'};
        // res.render('Tables/prospectus');


        var sql = "SELECT * FROM prospectus";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;


            //  studentRows= JSON.parse(JSON.stringify(data));
            // filepath=studentRows[0].fileupload;

            res.render('Tables/prospectus', {title: 'Prospectus', userData: data});
            // res.render('Tables/prospectus');


            // res.render('Tables/prospectus');

        });


    });

   
     //Admin Manage
    app.get('/admin', isUserAllowed, function (req, res) {
        res.locals = {title: 'Admin Management'};

        var sql = "SELECT * FROM admin";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('Admin/admin', {title: 'Admin Management', userData: data});

        });

    });
  
  
     //Admin Profile
    app.get('/admin-profile', isUserAllowed, function (req, res) {
        res.locals = {title: 'Admin Profile'};

        var sql = "SELECT * FROM admin";

        connection.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('Admin/admin-profile', {title: 'Admin Profile', userData: data});

        });
  
     });
  
  //Prospects/SendFB
    app.get('/prospectus/sendfb/:id', function (req, res) {
        var id = req.params.id;
        var filepath = "";
        var sql = "SELECT * FROM prospectus WHERE prospectusID = " + id;
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            // res.render('Tables/prospectus', { title: 'Prospectus', userData: data});

            studentRows = JSON.parse(JSON.stringify(data));


            //console.log(studentRows[0].fileupload);
            filepath = studentRows[0].fileupload;
            // res.render('Tables/prospectus');

            res.download(filepath)

            // res.render('Tables/prospectus');

        });


    });
    app.get('/prospectus/download/:id', isUserAllowed, function (req, res) {
        var id = req.params.id;
        var filepath = "";
        var sql = "SELECT * FROM prospectus WHERE prospectusID = " + id;
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            // res.render('Tables/prospectus', { title: 'Prospectus', userData: data});

            studentRows = JSON.parse(JSON.stringify(data));


            //console.log(studentRows[0].fileupload);
            filepath = studentRows[0].fileupload;
            // res.render('Tables/prospectus');

            res.download(filepath)

            // res.render('Tables/prospectus');

        });


    });

    app.post('/events/add', isUserAllowed, function (req, res) {
        var txtvenue = req.body.txtvenue;
        var txttitle = req.body.txttitle;
        var txtdesc = req.body.txtdesc;
        var txtdate = req.body.txtdate;
        var txttime = req.body.txttime;

        console.log(txtvenue);
        console.log(txttitle);
        console.log(txtdesc);
        console.log(txtdate);
        console.log(txttime);


        var StoreOTP = new Promise(function (resolve, reject) {
            var studentCPOTP = "";
            var sqlw2 = "INSERT INTO events values('','" + txtvenue + "','" + txttitle + "','" + txtdesc + "','" + txtdate + "','" + txttime + "',0)";
            console.log(sqlw2);

            connection.query(sqlw2, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {
                    return;
                }

                resolve(studentCPOTP)
            });

        });


        res.redirect('/events');
        //res.render('/events');
    });

  //events update
  app.post('/events/update', isUserAllowed, function (req, res) {
        var txtvenue = req.body.txtvenue;
        var txttitle = req.body.txttitle;
        var txtdesc = req.body.txtdesc;
        var txtdate = req.body.txtdate;
        var txttime = req.body.txttime;

        console.log(txtvenue);
        console.log(txttitle);
        console.log(txtdesc);
        console.log(txtdate);
        console.log(txttime);


        var StoreOTP = new Promise(function (resolve, reject) {
            var studentCPOTP = "";
            var sqlw2 = "INSERT INTO events values('','" + txtvenue + "','" + txttitle + "','" + txtdesc + "','" + txtdate + "','" + txttime + "',0)";
            console.log(sqlw2);

            connection.query(sqlw2, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {
                    return;
                }

                resolve(studentCPOTP)
            });

        });


        res.redirect('/events');
        //res.render('/events');
    });


  
  
  //delete prospectus
      app.get('/prospectus/delete/:id', isUserAllowed, function (req, res) {
        var id = req.params.id;

        var query = "DELETE FROM prospectus WHERE prospectusID = " + id;
        // res.locals = { title: 'Prospectus' };
        // res.render('Tables/prospectus');

        console.log(query);
        connection.query(query, function (err2, data2, fields2) {
            if (err2) throw err2;
        });
        //res.redirect('/events');
    });
  
  
  
  // delete events
    app.get('/events/delete/:id', isUserAllowed, function (req, res) {
        var id = req.params.id;

        var query = "DELETE FROM events WHERE events_id = " + id;
        // res.locals = { title: 'Prospectus' };
        // res.render('Tables/prospectus');


        console.log(query);
        connection.query(query, function (err2, data2, fields2) {
            if (err2) throw err2;
        });
        //res.redirect('/events');
    });

      app.get('/admin/delete/:id', isUserAllowed, function (req, res) {
        var id = req.params.id;

        var query = "DELETE FROM admin WHERE admin_id = " + id;
        console.log(query);
        connection.query(query, function (err2, data2, fields2) {
            if (err2) throw err2;
        });

    });

    app.get('/extended-sweet-alert', isUserAllowed, function (req, res) {
        res.locals = {title: 'SweetAlert 2'};
        res.render('Extended/extended-sweet-alert');
    });

    // Layouts
    app.get('/layouts-horizontal', isUserAllowed, function (req, res) {
        res.locals = {title: 'Horizontal'};
        res.render('Dashboard/index', {layout: 'layoutsHorizontal'});
    });
    app.get('/layouts-light-sidebar', isUserAllowed, function (req, res) {
        res.locals = {title: 'Light Sidebar'};
        res.render('Dashboard/index', {layout: 'layoutsLightSidebar'});
    });
    app.get('/layouts-compact-sidebar', isUserAllowed, function (req, res) {
        res.locals = {title: 'Compact Sidebar'};
        res.render('Dashboard/index', {layout: 'layoutsCompactSidebar'});
    });
    app.get('/layouts-icon-sidebar', isUserAllowed, function (req, res) {
        res.locals = {title: 'Icon Sidebar'};
        res.render('Dashboard/index', {layout: 'layoutsIconSidebar'});
    });
    app.get('/layouts-boxed', isUserAllowed, function (req, res) {
        res.locals = {title: 'Boxed Width'};
        res.render('Dashboard/index', {layout: 'layoutsBoxed'});
    });
    app.get('/layouts-colored-sidebar', isUserAllowed, function (req, res) {
        res.locals = {title: 'Colored Sidebar'};
        res.render('Dashboard/index', {layout: 'layoutsColoredSidebar'});
    });

    app.get('/layouts-h-boxed', isUserAllowed, function (req, res) {
        res.locals = {title: 'Boxed Width'};
        res.render('Dashboard/index', {layout: 'layoutsHBoxed'});
    });
    app.get('/layouts-h-topbar-light', isUserAllowed, function (req, res) {
        res.locals = {title: 'Topbar Light'};
        res.render('Dashboard/index', {layout: 'layoutsHTopbarLight'});
    });


    // widgets
    app.get('/Widgets', isUserAllowed, function (req, res) {
        res.locals = {title: 'Widgets'};
        res.render('Widgets/widgets');
    });

    // Email
    app.get('/email-inbox', isUserAllowed, function (req, res) {
        res.locals = {title: 'Inbox'};
        res.render('Email/email-inbox');
    });
    app.get('/email-read', isUserAllowed, function (req, res) {
        res.locals = {title: 'Email Read'};
        res.render('Email/email-read');
    });
    app.get('/email-compose', isUserAllowed, function (req, res) {
        res.locals = {title: 'Email Compose'};
        res.render('Email/email-compose');
    });
    app.get('/email-templates-basic', isUserAllowed, function (req, res) {
        res.locals = {title: 'Basic Action Email'};
        res.render('Email/Templates/email-templates-basic');
    });
    app.get('/email-templates-alert', isUserAllowed, function (req, res) {
        res.locals = {title: 'Alert Email'};
        res.render('Email/Templates/email-templates-alert');
    });
    app.get('/email-templates-billing', isUserAllowed, function (req, res) {
        res.locals = {title: 'Billing Email'};
        res.render('Email/Templates/email-templates-billing');
    });

    // Calendar
    app.get('/calendar', isUserAllowed, function (req, res) {
        res.locals = {title: 'Calendar'};
        res.render('Calendar/calendar');
    });

    // analytics
    app.get('/analytics', isUserAllowed, function (req, res) {
        res.locals = {title: 'Analytics'};
        res.render('Analytics/analytics');
    });

    // students
    app.get('/students', isUserAllowed, function (req, res) {
        res.locals = {title: 'Students'};
        res.render('Students/students');
    });

    // UI
    app.get('/ui-buttons', isUserAllowed, function (req, res) {
        res.locals = {title: 'Buttons'};
        res.render('Ui/ui-buttons');
    });
    app.get('/ui-colors', isUserAllowed, function (req, res) {
        res.locals = {title: 'Colors'};
        res.render('Ui/ui-colors');
    });
    app.get('/ui-cards', isUserAllowed, function (req, res) {
        res.locals = {title: 'Cards'};
        res.render('Ui/ui-cards');
    });
    app.get('/ui-tabs-accordions', isUserAllowed, function (req, res) {
        res.locals = {title: 'Tabs & Accordions'};
        res.render('Ui/ui-tabs-accordions');
    });
    app.get('/ui-modals', isUserAllowed, function (req, res) {
        res.locals = {title: 'Modals'};
        res.render('Ui/ui-modals');
    });
    app.get('/ui-images', isUserAllowed, function (req, res) {
        res.locals = {title: 'Images'};
        res.render('Ui/ui-images');
    });
    app.get('/ui-alerts', isUserAllowed, function (req, res) {
        res.locals = {title: 'Alerts'};
        res.render('Ui/ui-alerts');
    });
    app.get('/ui-progressbars', isUserAllowed, function (req, res) {
        res.locals = {title: 'Progress Bars'};
        res.render('Ui/ui-progressbars');
    });
    app.get('/ui-dropdowns', isUserAllowed, function (req, res) {
        res.locals = {title: 'Dropdowns'};
        res.render('Ui/ui-dropdowns');
    });
    app.get('/ui-lightbox', isUserAllowed, function (req, res) {
        res.locals = {title: 'Lightbox'};
        res.render('Ui/ui-lightbox');
    });
    app.get('/ui-navs', isUserAllowed, function (req, res) {
        res.locals = {title: 'Navs'};
        res.render('Ui/ui-navs');
    });
    app.get('/ui-pagination', isUserAllowed, function (req, res) {
        res.locals = {title: 'Pagination'};
        res.render('Ui/ui-pagination');
    });
    app.get('/ui-popover-tooltips', isUserAllowed, function (req, res) {
        res.locals = {title: 'Popover & Tooltips'};
        res.render('Ui/ui-popover-tooltips');
    });
    app.get('/ui-badge', isUserAllowed, function (req, res) {
        res.locals = {title: 'Badge'};
        res.render('Ui/ui-badge');
    });
    app.get('/ui-carousel', isUserAllowed, function (req, res) {
        res.locals = {title: 'Carousel'};
        res.render('Ui/ui-carousel');
    });
    app.get('/ui-video', isUserAllowed, function (req, res) {
        res.locals = {title: 'Video'};
        res.render('Ui/ui-video');
    });
    app.get('/ui-typography', isUserAllowed, function (req, res) {
        res.locals = {title: 'Typography'};
        res.render('Ui/ui-typography');
    });
    app.get('/ui-sweet-alert', isUserAllowed, function (req, res) {
        res.locals = {title: 'Sweet Alert'};
        res.render('Ui/ui-sweet-alert');
    });
    app.get('/ui-grid', isUserAllowed, function (req, res) {
        res.locals = {title: 'Grid'};
        res.render('Ui/ui-grid');
    });
    app.get('/ui-animation', isUserAllowed, function (req, res) {
        res.locals = {title: 'Animation'};
        res.render('Ui/ui-animation');
    });
    app.get('/ui-highlight', isUserAllowed, function (req, res) {
        res.locals = {title: 'Highlight'};
        res.render('Ui/ui-highlight');
    });
    app.get('/ui-rating', isUserAllowed, function (req, res) {
        res.locals = {title: 'Rating'};
        res.render('Ui/ui-rating');
    });
    app.get('/ui-nestable', isUserAllowed, function (req, res) {
        res.locals = {title: 'Nestable'};
        res.render('Ui/ui-nestable');
    });
    app.get('/ui-alertify', isUserAllowed, function (req, res) {
        res.locals = {title: 'Alertify'};
        res.render('Ui/ui-alertify');
    });
    app.get('/ui-rangeslider', isUserAllowed, function (req, res) {
        res.locals = {title: 'Range Slider'};
        res.render('Ui/ui-rangeslider');
    });
    app.get('/ui-sessiontimeout', isUserAllowed, function (req, res) {
        res.locals = {title: 'Session Timeout'};
        res.render('Ui/ui-sessiontimeout');
    });

    // Forms
    app.get('/form-elements', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Elements'};
        res.render('Form/form-elements');
    });
    app.get('/form-validation', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Validation'};
        res.render('Form/form-validation');
    });
    app.get('/form-advanced', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Advanced'};
        res.render('Form/form-advanced');
    });
    app.get('/form-wizard', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Wizard'};
        res.render('Form/form-wizard');
    });
    app.get('/form-editors', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Editors'};
        res.render('Form/form-editors');
    });


    app.get('/form-mask', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Mask'};
        res.render('Form/form-mask');
    });
    app.get('/form-xeditable', isUserAllowed, function (req, res) {
        res.locals = {title: 'Form Xeditable'};
        res.render('Form/form-xeditable');
    });

    // Charts
    app.get('/charts-morris', isUserAllowed, function (req, res) {
        res.locals = {title: 'Morris Chart'};
        res.render('Charts/charts-morris');
    });
    app.get('/charts-chartist', isUserAllowed, function (req, res) {
        res.locals = {title: 'Chartist Chart'};
        res.render('Charts/charts-chartist');
    });
    app.get('/charts-chartjs', isUserAllowed, function (req, res) {
        res.locals = {title: 'Chartjs Chart'};
        res.render('Charts/charts-chartjs');
    });
    app.get('/charts-flot', isUserAllowed, function (req, res) {
        res.locals = {title: 'Flot Chart'};
        res.render('Charts/charts-flot');
    });
    app.get('/charts-c3', isUserAllowed, function (req, res) {
        res.locals = {title: 'C3 Chart'};
        res.render('Charts/charts-c3');
    });
    app.get('/charts-sparkline', isUserAllowed, function (req, res) {
        res.locals = {title: 'Sparkline Chart'};
        res.render('Charts/charts-sparkline');
    });
    app.get('/charts-other', isUserAllowed, function (req, res) {
        res.locals = {title: 'Jquery Knob Chart'};
        res.render('Charts/charts-other');
    });
    app.get('/charts-peity', isUserAllowed, function (req, res) {
        res.locals = {title: 'Peity Chart'};
        res.render('Charts/charts-peity');
    });

    // Tables
    app.get('/tables-basic', isUserAllowed, function (req, res) {
        res.locals = {title: 'Basic Tables'};
        res.render('Tables/tables-basic');
    });
    app.get('/tables-datatable', isUserAllowed, function (req, res) {
        res.locals = {title: 'Datatable Tables'};
        res.render('Tables/tables-datatable');
    });
    app.get('/tables-responsive', isUserAllowed, function (req, res) {
        res.locals = {title: 'Responsive Tables'};
        res.render('Tables/tables-responsive');
    });
    app.get('/tables-editable', isUserAllowed, function (req, res) {
        res.locals = {title: 'Editable Tables'};
        res.render('Tables/tables-editable');
    });

    // Icons
    app.get('/icons-material', isUserAllowed, function (req, res) {
        res.locals = {title: 'Material Design'};
        res.render('Icons/icons-material');
    });
    app.get('/icons-ion', isUserAllowed, function (req, res) {
        res.locals = {title: 'Ion Icons'};
        res.render('Icons/icons-ion');
    });
    app.get('/icons-fontawesome', isUserAllowed, function (req, res) {
        res.locals = {title: 'Font Awesome'};
        res.render('Icons/icons-fontawesome');
    });
    app.get('/icons-themify', isUserAllowed, function (req, res) {
        res.locals = {title: 'Themify Icons'};
        res.render('Icons/icons-themify');
    });
    app.get('/icons-dripicons', isUserAllowed, function (req, res) {
        res.locals = {title: 'Dripicons'};
        res.render('Icons/icons-dripicons');
    });
    app.get('/icons-typicons', isUserAllowed, function (req, res) {
        res.locals = {title: 'Typicons Icons'};
        res.render('Icons/icons-typicons');
    });
    app.get('/icons-weather', isUserAllowed, function (req, res) {
        res.locals = {title: 'Weather Icons'};
        res.render('Icons/icons-weather');
    });
    app.get('/icons-mobirise', isUserAllowed, function (req, res) {
        res.locals = {title: 'Mobirise Icons'};
        res.render('Icons/icons-mobirise');
    });

    // Maps
    app.get('/maps-google', isUserAllowed, function (req, res) {
        res.locals = {title: 'Google Map'};
        res.render('Maps/maps-google');
    });
    app.get('/maps-vector', isUserAllowed, function (req, res) {
        res.locals = {title: 'Vector Map'};
        res.render('Maps/maps-vector');
    });

    // Pages
    app.get('/pages-timeline', isUserAllowed, function (req, res) {
        res.locals = {title: 'Timeline'};
        res.render('Pages/pages-timeline');
    });
    app.get('/pages-invoice', isUserAllowed, function (req, res) {
        res.locals = {title: 'Invoice'};
        res.render('Pages/pages-invoice');
    });
    app.get('/pages-directory', isUserAllowed, function (req, res) {
        res.locals = {title: 'Directory'};
        res.render('Pages/pages-directory');
    });
    app.get('/pages-blank', isUserAllowed, function (req, res) {
        res.locals = {title: 'Blank Page'};
        res.render('Pages/pages-blank');
    });
    app.get('/pages-404', isUserAllowed, function (req, res) {
        res.locals = {title: 'Error 404'};
        res.render('Pages/pages-404');
    });
    app.get('/pages-500', isUserAllowed, function (req, res) {
        res.locals = {title: 'Error 500'};
        res.render('Pages/pages-500');
    });
    app.get('/pages-pricing', isUserAllowed, function (req, res) {
        res.locals = {title: 'Pricing'};
        res.render('Pages/pages-pricing');
    });
    app.get('/pages-gallery', isUserAllowed, function (req, res) {
        res.locals = {title: 'Gallery'};
        res.render('Pages/pages-gallery');
    });


    // Ecomerce
    app.get('/ecommerce-product-list', isUserAllowed, function (req, res) {
        res.locals = {title: 'Product List'};
        res.render('Ecommerce/ecommerce-product-list');
    });
    app.get('/ecommerce-product-grid', isUserAllowed, function (req, res) {
        res.locals = {title: 'Product Grid'};
        res.render('Ecommerce/ecommerce-product-grid');
    });
    app.get('/ecommerce-order-history', isUserAllowed, function (req, res) {
        res.locals = {title: 'Order History'};
        res.render('Ecommerce/ecommerce-order-history');
    });
    app.get('/ecommerce-customers', isUserAllowed, function (req, res) {
        res.locals = {title: 'Customers'};
        res.render('Ecommerce/ecommerce-customers');
    });
    app.get('/ecommerce-product-edit', isUserAllowed, function (req, res) {
        res.locals = {title: 'Product Edit'};
        res.render('Ecommerce/ecommerce-product-edit');
    });

    // FAQs
    app.get('/faq', isUserAllowed, function (req, res) {
        res.locals = {title: 'FAQ'};
        res.render('FAQ/faq');
    });

    // Contact
    app.get('/contact', isUserAllowed, function (req, res) {
        res.locals = {title: 'Contact'};
        res.render('Contact/contact');
    });

}