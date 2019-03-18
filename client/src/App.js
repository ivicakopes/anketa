import React, { Component } from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,  
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Weather from './Weather';

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       weather: null,
       cityList: [],
       newCityName: '',
       vrsteList: [],
       bazaVrste:[],
       novaVrstaNaziv: '',
       novoPitanje: '',
       pitanjeSaId: null,
       pitanjaList: [],
       bazaPitanja: []
    };
  }
//-----------------------------------------------------
  getCityList = () => {
    fetch('/api/cities')
    .then(res => res.json())
    .then(res => {
      var cityList = res.map(r => r.city_name);
      this.setState({ cityList });      
    });
  };

  getPitanjaList = () => {
    fetch('/api/pitanja')
    .then(res => res.json())
    .then(res => {      
      var bazaPitanja = res;
      this.setState({ bazaPitanja });
      var pitanjaList = res.map(r => r.pitanje);
      this.setState({ pitanjaList });      
    });
  };

  getPitanjeByTekst = () => {
    var pit = this.state.novoPitanje;
    fetch(`/api/pitanja/${pit}`)
    .then(res =>res.json())
    .then(pitanjeSaId => {
      console.log('resultat 2 je ' + pitanjeSaId.id_pitanja.value);      
      this.setState({ pitanjeSaId });
      console.log('2. potrebno');  
      console.log('1.GETPITANJE ' + this.state.pitanjeSaId.pitanje); 
      
    });
  };

  getVrsteList = () => {
    fetch('/api/vrste')
    .then(res => res.json())    
    .then(res => {
      console.log('resultat vrste res ' + res);
      var bazaVrste = res;
      this.setState({ bazaVrste });
      var vrsteList = res.map(r => r.naziv_vrste);
      this.setState({ vrsteList });      
      //console.log(this.state.vrsteList);
      
    });
  };
//-----------------------------------------------------
  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  handleInputChangeVrste = (e) => {
    this.setState({ novaVrstaNaziv: e.target.value });
  };

  handleInputChangePitanje = (e) => {
    this.setState({ novoPitanje: e.target.value });
  };
//-----------------------------------------------------
  handleAddCity = () => {
    fetch('/api/cities', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: this.state.newCityName })
    })
    .then(res => res.json())
    .then(res => {
      this.getCityList();
      this.setState({ newCityName: '' });
    });
  };

  handleDodajVrstu = () => {
    fetch('/api/vrste', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vrste: this.state.novaVrstaNaziv })
    })
    .then(res => res.json())
    .then(res => {
      this.getVrsteList();
      this.setState({ novaVrstaNaziv: '' });
    });
  };

  handleDodajPitanje = () => {
    console.log('1. potrebno'); 
    fetch('/api/pitanja', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitanje: this.state.novoPitanje })
    })
    .then(() => fetch(`/api/pitanja/${this.state.novoPitanje}`))
    .then(res => res.json())
    .then(res => {
      var pitanjeSaId = res[0];
      this.setState({ pitanjeSaId });
      this.setState({ novoPitanje: ''});    //brise tekst pitanja ,ali ima ceo slog u pitanjeSaId
      this.getPitanjaList(); 
      for (const checkbox of this.selectedCheckboxes) {
        this.handleDodajPV(this.state.pitanjeSaId.id_pitanja,checkbox);
      }      
    })   
  }

  handleDodajPV = (pitanje, vrsta) => {
    console.log(pitanje,vrsta);    
    fetch('/api/pv', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitanje: pitanje, vrsta: vrsta })
    })
  };
  
//-----------------------------------------------------
  getWeather = (city) => {
    fetch(`/api/weather/${city}`)
    .then(res => res.json())
    .then(weather => {
      console.log(weather);
      this.setState({ weather });
    });
  }
//-----------------------------------------------------
  handleChangeCity = (e) => {
    this.getWeather(e.target.value);
  }

  handleChangeVrsta = (e) => {
    this.getWeather(e.target.value);
  }
//-----------------------------------------------------
  componentDidMount () {
    this.getCityList();
    this.getVrsteList();
    this.selectedCheckboxes = new Set();
  }

  // za checkboxes  ------------------------------------

  toggleCheckbox = e => {
    var label = e.target.value;
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">Anketa</NavbarBrand>
        </Navbar>
       
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">Anketa</h1>
              <p className="lead">Popunite anketu da bi unapredili našu saradnju!</p>
              <InputGroup>
                <Input 
                  placeholder="Nova vrsta korisnika..."
                  value={this.state.novaVrstaNaziv}
                  onChange={this.handleInputChangeVrste}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleDodajVrstu}>Dodaj novu vrstu korisnika</Button>
                </InputGroupAddon>                
              </InputGroup><br/>

              <InputGroup>
                <Input 
                  placeholder="Add new city..."
                  value={this.state.newCityName}
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddCity}>Add new city</Button>
                </InputGroupAddon>                              
              </InputGroup><br/> 

             
                <FormGroup>
                  <Input 
                    placeholder="Novo pitanje ..."
                    value={this.state.novoPitanje}
                    onChange={this.handleInputChangePitanje}
                  /><br/>                 
                  { this.state.bazaVrste.map((vrsta, i) =><div  key={i}><Input type="checkbox" onClick={this.toggleCheckbox} key={vrsta.id_vrste} value={vrsta.id_vrste} />{vrsta.naziv_vrste}<br/></div> ) }
                  <br/> 
                  <InputGroupAddon addonType="append">
                      <Button color="primary" onClick={this.handleDodajPitanje}>Dodaj pitanje</Button>
                  </InputGroupAddon>
                </FormGroup>
              
            </Jumbotron>
          </Col>
        </Row>
        <Row>
        <Col>
            <h1 className="display-5">Vrste korisnika</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeVrsta}>
                { this.state.vrsteList.length === 0 && <option>Nisu još dodate vrste.</option> }
                { this.state.vrsteList.length > 0 && <option>Selektuj vrstu.</option> }
                 { this.state.vrsteList.map((vrsta, i) => <option key={i}>{vrsta}</option>) }                 
              </Input>             
            </FormGroup>
           
          </Col>
          <Col>
            <h1 className="display-5">Current Weather</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeCity}>
                { this.state.cityList.length === 0 && <option>No cities added yet.</option> }
                { this.state.cityList.length > 0 && <option>Select a city.</option> }
                { this.state.cityList.map((city, i) => <option key={i}>{city}</option>) }
              </Input>
            </FormGroup>
          </Col>
         
        </Row>
        <Weather data={this.state.weather}/>
      </Container>
    );
  }
}

export default App;
