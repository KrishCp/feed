/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
import { getDonation } from "../api";
import { getDonationItems, setDonationItems } from "../localStorage";
import { parseRequestUrl, rerender } from "../utils";

// Function to render the PayPal Smart Payment Buttons with "Pay Later" option disabled
function renderPayPalButtons() {
  // Initialize PayPal Smart Payment Buttons with disableFunding option
  paypal.Buttons({
    // eslint-disable-next-line func-names
    createOrder: function (data, actions) {
      // Calculate the total amount
      const donationItems = getDonationItems();
      const totalAmount = donationItems.reduce((total, item) => total + item.price * item.qty, 0);

      // Create an order with the total amount
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2), // Format the total amount to two decimal places
            },
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      // Handle the approval of the payment
      return actions.order.capture().then(function (details) {
        // Payment completed; clear the cart (remove items)
        setDonationItems([]);
        
        // You can perform additional actions here, such as recording the donation or updating the UI
        console.log("Payment completed:", details);
        // Redirect to a thank you page or update the UI as needed
        document.location.hash = '/thank-you';
      });
    },
    // Disable the "Pay Later" option
    disableFunding: "paylater", // This disables "Pay Later" option
  }).render("#paypal-button-container"); // Replace with the ID of your PayPal button container element
}

const addToDonations = (item, forceUpdate = false) => {
  let donationItems = getDonationItems();
  const existItem = donationItems.find((x) => x.donation === item.donation);
  if (existItem) {
    if (forceUpdate) {
      donationItems = donationItems.map((x) =>
        x.donation === existItem.donation ? item : x
      );
    }
  } else {
    donationItems = [...donationItems, item];
  }
  setDonationItems(donationItems);
  if (forceUpdate) {
    rerender(donationsScreen);
  }
};

const removeFromDonation = (id) => {
  setDonationItems(getDonationItems().filter((x) => x.donation !== id));
  if (id === parseRequestUrl().id) {
    document.location.hash = '/donations';
  } else {
    rerender(donationsScreen);
  }
};

const donationsScreen = {
  after_render: () => {
    const qtySelects = document.getElementsByClassName("qty-select");
    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener('change', (e) => {
        const item = getDonationItems().find((x) => x.donation === qtySelect.id);
        addToDonations({ ...item, qty: Number(e.target.value) }, true);
      });
    });
    const deleteButtons = document.getElementsByClassName("delete-button");
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        removeFromDonation(deleteButton.id);
      });
    });
    // Render PayPal buttons
    renderPayPalButtons();
  },
  render: async () => {
    const request = parseRequestUrl();
    if (request.id) {
      const donation = await getDonation(request.id);
      addToDonations({
        // eslint-disable-next-line no-underscore-dangle
        donation: donation._id,
        name: donation.name,
        image: donation.image,
        price: donation.price,
        count: donation.count,
        qty: 1,
      });
    }
    const donationItems = getDonationItems();

    return `
      <div class="content cart">
        <div class="don-list">
          <ul class="don-list-container">
            <li>
              <h3>Donations</h3>
              <div>Price</div>
            </li>
            ${
              donationItems.length === 0
                ? '<div>No Donations Here. <a href="/#/">Get Donating!!!</a></div>'
                : donationItems
                    .map(
                      (item) => `
                        <li>
                          <div class="don-image">
                            <img src="${item.image}" alt="${item.name}" />
                          </div>
                          <div class="don-name">
                            <div>
                              <a href="/#/donation/${item.donation}">
                                <div class="nameof">${item.name}</div>
                              </a>
                            </div>
                            <div>
                              Qty:
                              <select class="qty-select" id="${item.donation}">
                                ${[...Array(item.count).keys()]
                                  .map(
                                    (x) =>
                                      item.qty === x + 1
                                        ? `<option selected value="${x + 1}">${x + 1}</option>`
                                        : `<option value="${x + 1}">${x + 1}</option>`
                                  )
                                  .join('\n')}
                              </select>
                              <button type="button" class="delete-button" id="${item.donation}">Delete</button>
                            </div>
                          </div>
                          <div class="don-price">$${item.price}</div>
                        </li>
                      `
                    )
                    .join('\n')
            }
          </ul>
        </div>
        <div class="don-action">
          <h3>
            Donations Subtotal (${donationItems.reduce((a, c) => a + c.qty, 0)} item):
            $${donationItems.reduce((a, c) => a + c.price * c.qty, 0)}
          </h3>
          <!-- PayPal button container -->
          <div id="paypal-button-container"></div>
        </div>
      </div>
    `;
  },
};

export default donationsScreen;
