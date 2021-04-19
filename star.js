// Class definition for celestial object

class star {

	constructor(name,ra,dec,teff,pl_pnum,st_rad,st_optmag,st_dist) {

		this.setName(name);
		this.setRA(ra);
		this.setDec(dec);
		this.setTeff(teff);
		this.setPlNum(pl_pnum);
		this.setStRad(st_rad);
		this.setApMag(st_optmag);
		this.setDist(st_dist);
		this.setSpecTypes();
		this.setHabZone();
	}
	// Setter
	setName(name) {
		this.name = name;
	}
	setRA(ra) {
		this.ra = ra;
	}
	setDec(dec) {
		this.dec = dec;
	}
	setTeff(teff) {
		this.teff = teff;
	}
	setPlNum(pl_pnum) {
		this.PlNum = pl_pnum;
	}
	setStRad(st_rad) {
		this.StRad = st_rad;
	}
	setApMag(st_optmag) {
		this.ApMag = st_optmag;
	}
	setDist(st_dist) {
		this.Dist=st_dist;
	}
	setSpecTypes(){
		if (this.teff<3500) {
			this.SpecType = "M";
			this.Color = "Red";
			this.BolCons = -2.0;
	    } else if (this.teff>3500 && this.teff<5000) {
    		this.SpecType = "K";
    		this.Color = "Orange";
    		this.BolCons = -0.8;
	    } else if (this.teff>5000 && this.teff<6000) {
      		this.SpecType = "G";
      		this.Color = "yellow";
      		this.BolCons = -0.4;
   		} else if (this.teff>6000 && this.teff<7500) {
   			this.SpecType = "F";
   			this.Color = "White";
   			this.BolCons = -0.15;
	    } else if (this.teff>7500 && this.teff<11000) {
	    	this.SpecType = "A";
	    	this.Color = "LightBlue";
	    	this.BolCons = -0.3;
   		} else if (this.teff>11000 && this.teff<25000) {
      		this.SpecType = "B";
      		this.Color = "blue";
      		this.BolCons = -2.0;
      	} else if (this.teff>25000) {
      		this.SpecType = "O";
			this.Color = "black";
			this.BolCons = null; 
    	} else {
    		this.teff=null;
    	}
	}
	setHabZone() {
		if (this.BolCons!=null) {
			var absmag = this.ApMag-5*Math.log(this.Dist/10);
			var bolmag = absmag + this.BolCons;
			var abslum = Math.pow(10,((bolmag - 4.75)/-2.5));
			this.HabZoneMin = Math.sqrt(abslum/1.1);
			this.HabZoneMax = Math.sqrt(abslum/0.53);			
		}
	}
	// Getter
	getName() {
		return this.name;
	}
	getRA() {
		return this.ra;
	}
	getDec() {
		return this.dec;
	}
	getTeff() {
		return this.teff;
	}
	getPlNum() {
		return this.PlNum;
	}
	getStRad() {
		return this.StRad;
	}
	getApMag() {
		return this.ApMag;
	}
	getDist() {
		return this.Dist;
	}
	getType() {
		return this.SpecType;
	}
	getColor() {
		return this.Color;
	}
	getHabZoneMin() {
		return this.HabZoneMin;
	}
	getHabZoneMax() {
		return this.HabZoneMax;
	}
}


class planet {

	constructor(name, ra, dec, pl_orbsmax, pl_hostname, hosthabmax, hosthabmin) {

		this.setName(name);
		this.setRA(ra);
		this.setDec(dec);
		this.setPlDist(pl_orbsmax);
		this.setHostName(pl_hostname);
		this.setHostHabMax(hosthabmax);
		this.setHostHabMin(hosthabmin);
	}

	// Setter
	setName(name) {
		this.name = name;
	}
	setRA(ra) {
		this.ra = ra;
	}
	setDec(dec) {
		this.dec = dec;
	}
	setPlDist(pl_orbsmax) {
		if (pl_orbsmax>0) {
			this.PlDist = pl_orbsmax;
		} else {
			this.PlDist = null;
		}

	}
	setHostName(pl_hostname) {
		this.host = pl_hostname;
	}
	setHostHabMax(hosthabmax) {
		this.hosthabmax = hosthabmax;
	}
	setHostHabMin(hosthabmin) {
		this.hosthabmin = hosthabmin;
	}
	// Getter
	getName() {
		return this.name;
	}
	getRA() {
		return this.ra;
	}
	getDec() {
		return this.dec;
	}
	getPlDist() {
		return this.PlDist;
	}
	getHost() {
		return this.host;
	}
	getHostHabMax() {
		return this.hosthabmax;
	}
	getHostHabMin() {
		return this.hosthabmin;
	}
}