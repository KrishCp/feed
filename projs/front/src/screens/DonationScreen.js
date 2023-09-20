import { getDonation } from '../api';
import{parseRequestUrl} from '../utils';


const DonationScreen = {
    after_render: () => {
        const requset = parseRequestUrl();
        document.getElementById("add-button").addEventListener('click',
        () =>{
            document.location.hash = `/donations/${requset.id}`;
        });
    },
    render: async ()=>{
        const requset = parseRequestUrl(); 
        const donation = await getDonation(requset.id);
        if(donation.error){
            return`<div>${donation.error}</div>`;
        }
        return `
        <div class ="content">
        
           <div class="details">
           <div class= "details-image">
              <img src="${donation.image}" alt="${donation.name}"/>
              </div>
              <div class ="details-info">
              <ul>
              <li>
                   <h1>${donation.name}</h1>
                   </li>
                   <li>
                   Donation Amount: <strong>$${donation.price}</strong>

                   </li>
                   <li>
                   Descripotion:
                   <div>
                     ${donation.sum}
                   </div>
                    </li>
                   </ul>
              </div>
              <div class = "details-action">
              <ul>
              <li>
              Donation Amount: $${donation.price}
              </li>
              <li>
              Status: ${donation.stat}
              </li>
              <li>
                 <button id = "add-button"class = "fw primary"> Donate </div>
              </ul>
              </div>
           </div>
        </div>`;
 },
};
export default DonationScreen;