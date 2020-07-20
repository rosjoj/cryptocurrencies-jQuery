function onClickMoreInfo(event, coin) {
   const activeBtn = event.target;
   if (!activeBtn.isOpen) {
      const card = $(`#card-${coin.id}`);
      let localData = localStorage.getItem(coin.id);
      if (!localData) {
         console.log('fetch data from server');
         card.html(`<div class='loader'></div>`);
         $('.loader').css({ "width": "70px", "height": "70px" });
         $.get(`https://api.coingecko.com/api/v3/coins/${coin.id}`, data => {
            let USD = data.market_data.current_price.usd;
            let EUR = data.market_data.current_price.eur;
            let ILS = data.market_data.current_price.ils;
            console.log('data', data);
            $('.loader').css("display", "none");
            localStorage.setItem(data.id, JSON.stringify(data));
            setTimeout(() => {
               localStorage.removeItem(data.id);
            }, 120000);
            card.html(`
            <div>
            <table>
               <td><img src="${data.image.small}"/></td>
              <td class="td">
              <ul>
              <li>${USD}&#36</li>
              <li>${EUR}&#8364</li>
              <li>${ILS}&#8362</li>
              <ul>
              </td>
              </table>
					</div>
				`);
         });
      } else {
         console.log('fetch data from local storage');
         localData = JSON.parse(localData);
         let USD = localData.market_data.current_price.usd;
         let EUR = localData.market_data.current_price.eur;
         let ILS = localData.market_data.current_price.ils;
         card.html(`
         <div>
         <table>
            <td><img src="${localData.image.small}"/></td>
           <td class="td">
           <ul>
           <li>${USD}&#36</li>
           <li>${EUR}&#8364</li>
           <li>${ILS}&#8362</li>
           <ul>
           </td>
           </table>
            </div>
		`);
      }
   }
   activeBtn.isOpen = !activeBtn.isOpen;
}
let selectedItems = [];
let coinsarray = [];
const main = $('#dmain');
main.append(`<div class='loader'></div>`);
$.get(`https://api.coingecko.com/api/v3/coins/list`, coins => {
   $('.loader').css("display", "none");

   for (let i = 0; i < 100; i++) {
      coinsarray.push(coins[i]);
      // let coinsId = coin.id;
   }
   console.log('coinsarray', coinsarray);
   coinsarray.forEach((coin, i) => {
      $('#dmain').append(`
              <div class="coinsarea" > 
              <label class="switch">
              <input type="checkbox" name="toggle" id=${coin.symbol} class="toggle">
              <span class="slider round"></span>
              </label>
              <p class="coinsymbol"><b>${coin.symbol}</b></p>
              <p>${coin.name}</p>                            
              <button  onclick='onClickMoreInfo(event,${JSON.stringify(coin)})' 
				  		class="btn btn-primary"  type="button" data-toggle="collapse" data-target="#${i}"
              aria-expanded="false" aria-controls="collapseExample">
                More Info
              </button>
               <div class="collapse" id="${i}">
              <div  class="container-fluid" id="card-${coin.id}"></div></div>
              </div> `);

      toggle = $('.toggle');
      //console.log('toggle', toggle);
      for (let i = 0; i < toggle.length; i++) {
         toggle[i].addEventListener('click', selectCoins);
         console.log(toggle[i].id)
         for (let e = 0; e < selectedItems.length; e++) {
            console.log('selectedItems[i]', selectedItems[e]);
            if (toggle[i].id == selectedItems[e]) {
               toggle[i].checked = true;
            }
         }
      }
   });

   function selectCoins(e) {
      const selectedCheckBox = e.target;
      console.log('selectedCheckBox', selectedCheckBox.id);

      if (selectedCheckBox.checked) {
         if (selectedItems.length < 5) {
            selectedItems.push(selectedCheckBox.id);
            console.log('beforedelete', selectedItems);
         } else {
            let modal = document.getElementById('modal-box');
            modal.style.display = 'flex';
            let modalbody = $('.modalbody');
            modalbody.html(`
                <ol id="modalol">
                <li class="modalli" id=${selectedItems[0]}>${selectedItems[0]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                 <li class="modalli" id=${selectedItems[1]}>${selectedItems[1]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                 <li class="modalli" id=${selectedItems[2]}>${selectedItems[2]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                 <li class="modalli" id=${selectedItems[3]}>${selectedItems[3]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                 <li class="modalli" id=${selectedItems[4]}>${selectedItems[4]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                 </ol>
                `);

            let xdelete = $('.delete');
            console.log('xdelete', xdelete);
            xdelete.toArray().forEach((xdelete, i) => {
               xdelete.addEventListener('click', function (e) {
                  const li = e.target.parentElement.parentElement;
                  li.parentNode.removeChild(li);
                  const deletedCoin = li.id;
                  const index = selectedItems.indexOf(deletedCoin);
                  selectedItems.splice(index, 1);
                  if (selectedItems == 0) {
                     modal.style.display = 'none';
                  }
                  const checkedinp = $('input:checked');
                  for (let e = 0; e < checkedinp.length; e++) {
                     if (deletedCoin == checkedinp[e].id) {
                        checkedinp[e].checked = false;
                     }
                  }
                  console.log('afterdelete', selectedItems);
               });
            });

            let close = $('.close');
            close.on('click', function () {
               modal.style.display = 'none';
            });
            let savchanges = $('#savchanges');
            savchanges.on('click', function () {
               modal.style.display = 'none';
            });
            e.preventDefault();
         }
      }
      else {
         const index = selectedItems.indexOf(selectedCheckBox.id);
         console.log('index', index);
         selectedItems.splice(index, 1);
         console.log(selectedItems);
      }
   }
});

let searchInput;
let searchTerm;

let filter;
$('form').on('submit', function (e) {
   filter = '';
   e.preventDefault();
   searchInput = $('#search');
   searchTerm = searchInput.val().toLowerCase();
   console.log(searchTerm);
   if (searchTerm === '') {
      $('#dmain').show();

   } else {
      filter = searchTerm;
      findcoin();
      document.getElementById('myform').reset();
   }
});

const findcoin = () => {
   const filteredcoins = coinsarray.filter(coin => coin.symbol.includes(filter));
   console.log('filteredcoins', filteredcoins);
   console.log(`https://api.coingecko.com/api/v3/coins/` + filteredcoins[0].id);

   $.get(`https://api.coingecko.com/api/v3/coins/${filteredcoins[0].id}`, coin => {
      let USD = coin.market_data.current_price.usd;
      let EUR = coin.market_data.current_price.eur;
      let ILS = coin.market_data.current_price.ils;
      $('#about').hide();
      $('#dmain').hide();
      $('#foundcoin').show();
      $('#foundcoin').html(`
   <div class="coinsarea" >
   <label class="switch">
   <input type="checkbox" name="searchable"  id=${coin.symbol} class="toggle">
   <span class="slider round"></span>
   </label>
   <p class="coinsymbol"><b>${coin.symbol}</b></p>
   <p>${coin.name}</p>
   <p>
          <button onclick='onClickMoreInfo(event,${JSON.stringify(coin)})'
          class="btn btn-primary" type="button" data-toggle="collapse" data-target="#coin"
          aria-expanded="false" aria-controls="collapseExample">
            More Info
          </button>
          </p>
          <div class="collapse" id="coin">
          <div  class="container-fluid" id="card-${coin.id}"></div></div>
          </div>
 
   </div>

   
   `);
      let tog = $("input[name='searchable']");
      console.log('tog', tog[0].id);
      for (let i = 0; i < selectedItems.length; i++) {
         console.log('selectedItems[i]', selectedItems[i]);
         if (tog[0].id == selectedItems[i]) {
            tog[0].checked = true;
         }
      }
      tog.on('click', function (e) {
         let selectedCheckBox = e.target;
         console.log('newtarget', e.target);
         if (selectedCheckBox.checked) {
            if (selectedItems.length < 5) {
               for (let i = 0; i < toggle.length; i++) {
                  console.log('oggle', toggle[i].id);
                  if (toggle[i].id == selectedCheckBox.id) {
                     toggle[i].checked = true;
                  }

               }
               selectedItems.push(selectedCheckBox.id);
               console.log('beforedelete', selectedItems);
            } else {
               let modal = document.getElementById('modal-box');
               modal.style.display = 'flex';
               let modalbody = $('.modalbody');
               modalbody.html(`
                   <ol id="modalol">
                   <li class="modalli" id=${selectedItems[0]}>${selectedItems[0]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                    <li class="modalli" id=${selectedItems[1]}>${selectedItems[1]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                    <li class="modalli" id=${selectedItems[2]}>${selectedItems[2]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                    <li class="modalli" id=${selectedItems[3]}>${selectedItems[3]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                    <li class="modalli" id=${selectedItems[4]}>${selectedItems[4]}<span class="delete"><span class="glyphicon glyphicon-remove-circle"></span></span></li>
                    </ol>
                   `);

               let xdelete = $('.delete');
               console.log('xdelete', xdelete);
               xdelete.toArray().forEach((xdelete, i) => {
                  xdelete.addEventListener('click', function (e) {
                     const li = e.target.parentElement.parentElement;
                     li.parentNode.removeChild(li);
                     const deletedCoin = li.id;
                     const index = selectedItems.indexOf(deletedCoin);
                     selectedItems.splice(index, 1);
                     if (selectedItems == 0) {
                        modal.style.display = 'none';
                     }
                     const checkedinp = $('input:checked');
                     for (let e = 0; e < checkedinp.length; e++) {
                        if (deletedCoin == checkedinp[e].id) {
                           checkedinp[e].checked = false;
                        }
                     }
                     console.log('afterdelete', selectedItems);
                  });
               });

               let close = $('.close');
               close.on('click', function () {
                  modal.style.display = 'none';
               });
               let savchanges = $('#savchanges');
               savchanges.on('click', function () {
                  modal.style.display = 'none';
               });
               e.preventDefault();
            }
         }
         else {
            for (let i = 0; i < toggle.length; i++) {
               console.log('oggle', toggle[i].id);
               if (toggle[i].id == selectedCheckBox.id) {
                  toggle[i].checked = false;
               }

            }
            const index = selectedItems.indexOf(selectedCheckBox.id);
            console.log('index', index);
            selectedItems.splice(index, 1);
            console.log(selectedItems);
         }
      });
   });
};

function about() {
   $('#about').html(`
       <div id="aboutc" class="row" >
       <p class="col-xs-12 .col-sm-6 .col-lg-8"><img id="imgabout" src="images/crypto12.jpg"/>On this website you can get the information about cryptocurrencies.
       Press the MORE INFO button to get the visual illustration of each coin and
       find out the exchange rate towards the main currencies of the world.
       In addition you can choose up to 6 coins get acquainted with the live reports
       of the coins.</p>
       <p><b>About Cryprocurrencies</b></p
   <p>A cryptocurrency is a digital or virtual currency that
                 is secured by cryptography, which makes it nearly impossible
                 to counterfeit or double-spend. Many cryptocurrencies are
                 decentralized networks based on blockchain technology—a distributed
                 ledger enforced by a disparate network of computers. A defining
                 feature of cryptocurrencies is that they are generally not issued
                 by any central authority, rendering them theoretically immune to
   government interference or manipulation.</p>
   
  </div >
       `);
}
let links = document.querySelectorAll('.links');
console.log(links);
links.forEach(link => {
   link.addEventListener('click', function (e) {
      let id = e.target.id;
      if (id == '1') {
         $('#about').hide();
         $('#foundcoin').hide();
         $('#dmain').show();

      } else if (id == '2') {
      } else {
         $('#dmain').hide();

         $('#foundcoin').hide();
         $('#about').show();
         about();
      }
   });
});

