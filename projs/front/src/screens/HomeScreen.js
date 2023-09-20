/* eslint-disable no-underscore-dangle */
import axios from 'axios';

const HomeScreen = {
  render: async () => {
    const response = await axios({
      url: 'http://localhost:5000/api/donations',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response || response.statusText !== 'OK') {
      return '<div>Error</div>';
    }
    const donations = await response.data;
    return `
      <ul class="donations">
        ${donations.map((donation) => `
        <li>
         <div class="donation">
                
                  <a href="/#/donation/${donation._id}">
                    <img src="${donation.image}" alt="${donation.name}"/>
                  </a>
                  <div class="donation-name">
                    <a href="/#/donation/${donation._id}">
                      ${donation.name}
                    </a>
                  </div>
                  <div class="donation-price">
                    $${donation.price}
                  </div>
                  <div class="donation-sum">
                    ${donation.sum}
                  </div>
                </div>
              </li>
            `)
    .join('')}
    `;
  },
};
console.log(HomeScreen);
export default HomeScreen;
