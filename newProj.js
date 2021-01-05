var title = document.getElementsByClassName("game-title");
var availability = document.getElementsByClassName("availability");
var price = document.getElementsByClassName("price");
var mainSlide = document.getElementsByClassName("big-slide");
mainSlide = [].slice.call(mainSlide, 0, 4);
var medSlides = document.getElementsByClassName("medium-slide");
medSlides = [].slice.call(medSlides, 0, 16);
carouselThumbnails = [], temp = [];
(function() {
	for(var i = 0; i < 17; i++) {
		if(i%4 === 0) {
			carouselThumbnails.push(temp);
			temp = [];
		}
		temp.push(medSlides[i]);
	}
	carouselThumbnails.shift();
}());

var now = Date.now();
var bottomTabs = document.getElementsByClassName("bottom-tabs");

var slides = document.getElementsByClassName("slides");
var navSlides = document.getElementsByClassName("nav-slide");
navSlides[0].style.opacity = 1;
var left = document.getElementById("left");
var right = document.getElementById("right");
var currSlide = 0, currTab = 0;
var next, currPic;

var leftTabsText = document.getElementsByClassName("right-text");
var leftTabsImg = document.getElementsByClassName("left-img");
var rightSlideImgs = document.getElementsByClassName("right-slide-imgs");

left.addEventListener("click", prevSlide);
right.addEventListener("click", nextSlide);
left.addEventListener("mouseover", stop);
left.addEventListener("mouseleave", start);
right.addEventListener("mouseover", stop);
right.addEventListener("mouseleave", start);

for(var i = 0; i < medSlides.length; i++) {
	medSlides[i].addEventListener("mouseover", showPic);
	medSlides[i].addEventListener("mouseleave", unshowPic);
}

for(var j = 0; j < slides.length; j++) {
	slides[j].addEventListener("mouseover", stop);
	slides[j].addEventListener("mouseleave", start);
}

for(var k = 0; k < navSlides.length; k++) {
	navSlides[k].addEventListener("mouseover", light);
	navSlides[k].addEventListener("mouseover", stop);
	navSlides[k].addEventListener("mouseleave", start);
}

for(var l = 0; l < bottomTabs.length; l++) {
	bottomTabs[l].index = l;
	bottomTabs[l].addEventListener("click", activateTab);
}

function prevSlide() {
	navSlides[currSlide].style.opacity = 0.75;
	slides[currSlide].className = "slides";

	currSlide === 0 ? currSlide = 3 : currSlide--;

	navSlides[currSlide].style.opacity = 1;
	slides[currSlide].className = "slides showing";
}

function nextSlide() {
	navSlides[currSlide].style.opacity = 0.75;
	slides[currSlide].className = "slides";

	currSlide === 3 ? currSlide = 0 : currSlide++;

	navSlides[currSlide].style.opacity = 1;
	slides[currSlide].className = "slides showing";
}

function showPic() {
	currPic = this.parentNode.parentNode.childNodes[1].src;
	this.parentNode.parentNode.childNodes[1].src = this.src;
}

function unshowPic() {
	this.parentNode.parentNode.childNodes[1].src = currPic;
}

var id = setInterval(setCarousel, 3000);

function stop() {
	clearInterval(id);
}

function start() {
	id = setInterval(setCarousel, 3000);
}

function light() {
	if(currSlide !== this.title) {
		navSlides[currSlide].style.opacity = 0.75;
	}
	this.style.opacity = 1;
	slides[currSlide].className = "slides";
	currSlide = parseInt(this.title);
	slides[currSlide].className = "slides showing";
}

function setCarousel() {
	if( currSlide === 3) {
		slides[0].className = "slides showing";
		slides[currSlide].className = "slides";
		navSlides[0].style.opacity = 1;
		navSlides[currSlide].style.opacity = 0.75;
		return currSlide = 0; 
	}

	slides[currSlide+1].className = "slides showing";
	slides[currSlide].className = "slides";
	navSlides[currSlide+1].style.opacity = 1;
	navSlides[currSlide].style.opacity = 0.75;
	currSlide++;
}

function activateTab() {
	bottomTabs[currTab].className = "bottom-tabs";
	currTab = this.index;
	bottomTabs[currTab].className = "bottom-tabs tab-active";
}

//Cache

var allHype = {};

var mostPopular = {};

var highestRated = {};

var mostRecent = {};

var genres = {
	
};

//Ajax Logic

window.onload = $.when(getMostHyped(), getLatest()).then(function(){
	
	//mainSlide, medSlides
	//for(var i = 0; i < thumbnailURLs.length; i++) {
	//	medSlides[i].src = thumbnailURLs[i];
	//}
	
});

function getMostHyped() {
	
    
    return $.ajax({
        url: "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?&fields=name,screenshots,rating,release_dates.date,release_dates.human&order=hypes:desc&limit=4",
		type: 'GET',
		data: {},
        dataType: "json",          
        success: function(data) {
			
			data.forEach(function(ele, i) {
				if(ele.screenshots.length > 4) { ele.screenshots.length = 4; }

				title[i].innerHTML = ele.name;
				price[i].innerHTML = ele.name;

				now - ele.release_dates[0].date < 0 
				?   availability[i].innerHTML = "Coming " + ele.release_dates[0].human
				:   availability[i].innerHTML = "Available Now";

				var rep = ele.screenshots[0].url.replace("thumb", "logo_med");
				mainSlide[i].src = "https:" + rep;

				for(var j = 0; j < ele.screenshots.length; j++) {
					rep = ele.screenshots[j].url.replace("thumb", "logo_med");
					carouselThumbnails[i][j].src = "https:" + rep;
				}

			});

        },
		error: function(err) { alert(err); },
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Mashape-Authorization", "5HV7O6XCA9msh9x3nSnveY0bR309p1WmFeujsnFLC9f0zZxU4K");
		}
	});
}

function getLatest() {
	var aWeekAgo = now - 604800000;
    return $.ajax({
        url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,screenshots,summary&filter[release_dates.date][lte]=' + now + '&filter[release_dates.date][gte]=' + aWeekAgo + '&order=hypes:desc',
		type: 'GET',
		data: {},
        dataType: "json",          
        success: function(data) {
			
			console.log(data);

			//leftTabsText, leftTabsImg, rightSlideImgs

			data.forEach(function(ele, i) {
				
				if(ele.name.length > 20) { 
					ele.name = ele.name.slice(0, 20);
				}

				leftTabsText[i].innerHTML = ele.name;

				if(ele.screenshots === undefined) { return; }
				var rep = ele.screenshots[0].url.replace("thumb", "cover_small");
				leftTabsImg[i].src = "https:" + rep;

			});
        },
		error: function(err) { alert(err); },
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Mashape-Authorization", "5HV7O6XCA9msh9x3nSnveY0bR309p1WmFeujsnFLC9f0zZxU4K");
		}
	});
}

function getGreatest() {}

function getPopular() {}

function getComingSoon() {}
