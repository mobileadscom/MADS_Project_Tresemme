/*
*
* mads - version 2.00.01
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function (options) {

    var _this = this;

    this.render = options.render;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* json */
    if (typeof json == 'undefined' && typeof rma != 'undefined') {
        this.json = rma.customize.json;
    } else if (typeof json != 'undefined') {
        this.json = json;
    } else {
        this.json = '';
    }

    /* fet */
    if (typeof fet == 'undefined' && typeof rma != 'undefined') {
        this.fet = typeof rma.fet == 'string' ? [rma.fet] : rma.fet;
    } else if (typeof fet != 'undefined') {
        this.fet = fet;
    } else {
        this.fet = [];
    }

    this.fetTracked = false;

    /* load json for assets */
    this.loadJs(this.json, function () {
        _this.data = json_data;

        _this.render.render();
    });

    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {

    var tagsStr = '';

    for(var obj in tags){
        if(tags.hasOwnProperty(obj)){
            tagsStr+= '&'+obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){

        if(typeof this.ct != 'undefined' && this.ct != '') {
            url = this.ct + encodeURIComponent(url);
        }

		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}

        if(typeof this.cte != 'undefined' && this.cte != '') {
            this.imageTracker(this.cte);
        }
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {

    /*
    * name is used to make sure that particular tracker is tracked for only once
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type;

    if ( tt == 'E' && !this.fetTracked ) {
        for ( var i = 0; i < this.fet.length; i++ ) {
            var t = document.createElement('img');
            t.src = this.fet[i];

            t.style.display = 'none';
            this.bodyTag.appendChild(t);
        }
        this.fetTracked = true;
    }

    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

mads.prototype.imageTracker = function (url) {
    for ( var i = 0; i < url.length; i++ ) {
        var t = document.createElement('img');
        t.src = url[i];

        t.style.display = 'none';
        this.bodyTag.appendChild(t);
    }
}

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

var cities = ["Bandung","Jakarta","Samarinda","Pekanbaru","Balikpapan","Padang","Patam","Malang","Medan","Pangaturan","Tebingtinggi","Sungailiat","Palembang","Bengkalis","Jambi City","Depok","Bogor","Sangereng","Bekasi","Karawang","Sukabumi","Tasikmalaya","Subang","Ciamis","Cirebon","Garut","Kuningan","Majalengka","Sumedang","Sukoharjo","Semarang","Pekalongan","Kudus","Klaten","Jepara","Demak","Salatiga","Tegal","Yogyakarta","Sleman","Cilacap","Magelang","Wonosobo","Surakarta","Bantul","Temanggung","Kebumen","Purwokerto","Purbalingga","Kulon","Surabaya","Bangkalan","Pasuruan","Mojokerto","Sidoarjo","Surabayan","Batu","Blitar","Lumajang","Tulungagung","Magetan","Kediri","Trenggalek","Madiun","Ngawi","Nganjuk","Bojonegoro","Banyuwangi","Jember","Situbondo","Probolinggo","Gresik","Lamongan","Pamekasan","Pontianak","Singkawang","Banjarmasin","Buntok","Bontang","Palangkaraya","Tarakan","Denpasar","Badung","Ubud","Mataram","Selong","Manado","Tondano","Bitung","Bima","Sungguminasa","Adiantorop","Makassar","Sekupang","Kota","Bangkinang","Binjai","Banda Aceh","Lhokseumawe","Serdang","Balige","Lampeong","Baturaja","Bandar","Cimahi","Indramayu","Banyumas","Jombang","Mojoagung","Kepanjen","Ponorogo","Pacitan","Palu","Sengkang","Gorontalo","Gianyar","Jayapura","Soasio","Wonosari","Bengkulu","Guntung","Langsa","Kerinci","Porsea","Bali","Cianjur","Tirtagangga","Purworejo","Pandeglang","Tigaraksa","Cilegon","Cilegon","Sanur","Darussalam","Kupang","Bandar Lampung","Pati","Panasuan","Darmaga","Dumai","Timur","Riau","Bukit Tinggi","Parman","Cihampelas","Tangsel","Duren","Angkasa","Jimbaran","Menara","Pamulang","Bantan","Baratjaya","Utara","Veteran","Tengah","Tenggara","Selatan","Simpang","Gunungsitoli","Pemalang","Tenggarong","Tanjung Balai","Serang","Cikarang","Cibitung","Bondowoso","Singaraja","Poso","Ambon City","Negeribesar","Cempaka","Lestari","Kandangan","Ciputat","Kartasura","Jagakarsa","Pondok","Solo","Polerejo","Muntilan","Boyolali","Nusantara","Cipinanglatihan","Kalimantan","Serang","Serpong","Cikini","Purwodadi Grobogan","Kendal","Tanjungpinang","Lubuk Pakam","Nusa","Kelapa Dua","Gandul","Gedung","Tanjung","Kuta","Kalideres","Mega","Area","Wilayah","Soho","Menteng","Tuban","Cilincing","Sunggal","Sijunjung","Kerobokan","Negara","Amlapura","Baubau","Karanganyar","Sampang","Depok Jaya","Parakan","Lawang","Pare","Airmadidi","Tembagapura","Banjarbaru","Palangka","Cimanggis","Kebayoran Baru","Lapan","Pusat","Sigli","Kabanjahe","Pematangsiantar","Payakumbuh","Kebayoran Lama Selatan","Tigarasa","Purwakarta","Cibubur","Wonogiri","Sragen","Ungaran","Batang","Ambarawa","Palaihari","Tanjung","Sampit","Bulukumba","Bangli","Soe","Nusa Dua","Stabat","Maros","Tipar Timur","Holis","Banjarnegara","Banjar","Kopeng","Duri","Bantaeng","Blora","Tomohon","Citeureup","Pekan","Mamuju","Badung","Abadi","Anggrek","Sejahtera","Cakrawala","Indo","Sentul","Utama","Mail","Udayana","Cengkareng","Kemang","Tabanan"];

var TresAd = function() {
  this.app = new mads({
    'render': this
  })

  this.render(this.style)
  this.events()
}

TresAd.prototype.element = (function() {
  var elements = {}
  return {
    add: function(el) {
      elements[el.id] = el
    },
    of: function(id) {
      return elements[id]
    },
    all: function() {
      return elements
    }
  }
})()

TresAd.prototype.render = function(applyStyle) {
  this.app.contentTag.innerHTML = '<div id="container"><img id="page1" src="'+this.app.path+'img/one.png">'+
  '<div id="page2"><img id="two" src="'+this.app.path+'img/two.png">'+
  '<form id="form">'+
  '<input type="text" id="nama" placeholder="Nama" required>'+
  '<input type="number" id="umur" placeholder="Umur" required>'+
  '<input type="number" id="no" placeholder="No. Handphone" required>'+
  '<input type="text" list="cities" placeholder="Ketik nama kota" id="kota" required>'+
  '<datalist id="cities"></datalist>'+
  '<button type="submit" id="submit"><img src="'+this.app.path+'img/submit.png"></button>'+
  '</form>'+
  '</div>'+
  '<div id="page3"><img src="'+this.app.path+'img/last.png"><div id="code"></div></div></div>'

  var elements = this.app.contentTag.querySelectorAll('div, img, input, button, select, datalist, form')
  for (var i = 0, len = elements.length; i < len; i++) {
    this.element.add(elements[i])
  }

  for (var i = 0, len = cities.length; i < len; i++) {
      var option = document.createElement('option')
      option.innerText = cities[i]
      this.element.of('cities').appendChild(option)
  }

  applyStyle(this.element.all())
}

TresAd.prototype.style = function(els) {
  var css = 'body {margin:0;padding: 0;}  #container { position: relative; width: 320px; height: 480px; overflow: hidden; margin: 0; padding: 0; }'
  css += 'button {background: none; border: 0;}'
  css += 'form input, form select {width: 265px; height: 30px; padding: 0 10px; font-size: 16px; display: block; margin-bottom: 15px; }'
  css += 'form select { width: 289px;}'
  css += '#container > img, #container > div { width: 320px; height: 480px; }'
  css += '#form { position: absolute; text-align: right; top: 175px; left: 15px; }'
  css += '#code {position: absolute;bottom: 70px;left: 40px;color: #fff;font-family: sans-serif;letter-spacing: 5px;}'

  head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
      style.styleSheet.cssText = css;
  } else {
      style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);

  els.page2.style.display = 'none'
  els.page3.style.display = 'none'
}

TresAd.prototype.events = function() {
  var self = this;
  var el = this.element;
  el.of('page1').addEventListener('click', function() {
    el.of('page1').style.display = 'none'
    el.of('page2').style.display = ''
    self.app.tracker('E', 'coupon_click')
  })

  el.of('form').addEventListener('submit', function(e) {
    e.preventDefault();

    el.of('nama').style.border = ''
    el.of('umur').style.border = ''
    el.of('no').style.border = ''
    el.of('kota').style.border = ''

    var nama = el.of('nama').value;
    var umur = el.of('umur').value;
    var no = el.of('no').value;
    var kota = el.of('kota').value;

    if (/\S/.test(nama) && /\S/.test(umur) && /\S/.test(no) && /\S/.test(kota) &&
          umur >= 15 && umur <= 45 && cities.indexOf(kota) > -1) {

        var url = '//www.mobileads.com/api/save_lf?contactEmail=jeff@mobileads.com,adhie@mobileads.com,dickale@imx.co.id,karima@imx.co.id&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22'+nama+'%22},'+
        '{%22fieldname%22:%22text_2%22,%22value%22:%22'+umur+'%22},'+
        '{%22fieldname%22:%22text_3%22,%22value%22:%22'+no+'%22},'+
        '{%22fieldname%22:%22text_4%22,%22value%22:%22'+kota+'%22}]&user-id=2901&studio-id=240&tab-id=1&trackid=2113&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback'
        // TODO: tracker changed
        self.app.tracker('E', 'form_submit')
        self.app.loadJs(url)
    } else {
      if (!/\S/.test(nama)) {
        el.of('nama').style.border = '1px solid red'
      }

      if (!/\S/.test(umur)) {
        el.of('umur').style.border = '1px solid red'
      }

      if (!/\S/.test(no)) {
        el.of('no').style.border = '1px solid red'
      }

      if (!/\S/.test(kota)) {
        el.of('kota').style.border = '1px solid red'
      }

      if (umur < 15 || umur > 45) {
        el.of('umur').style.border = '1px solid red'
      }

      if (cities.indexOf(kota) === -1) {
        el.of('kota').style.border = '1px solid red'
      }
    }
  })
}

TresAd.prototype.onSubmit = function() {
  var el = this.element
  this.app.tracker('E', 'get_code')
  this.app.loadJs('//www.mobileads.com/get_unique_code?userId=2901&campaignId=194&studioId=238&isDemo=0&callback=getCode')
}

function getCode(c) {

  document.getElementById('page2').style.display = 'none'
  document.getElementById('page3').style.display = ''

  if (typeof c !== 'undefined' && c.hasOwnProperty('code')) {
    var code = document.querySelector('#code');
    code.innerHTML = c.code || 'No Code';
  }
}

function leadGenCallback(obj) {
  tresAd.onSubmit();
}

var tresAd = new TresAd()
