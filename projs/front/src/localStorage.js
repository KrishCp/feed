/* eslint-disable import/prefer-default-export */
export const getDonationItems = () => {
    const donationItems = localStorage.getItem('donationItems')? 
    JSON.parse(localStorage.getItem ('donationItems')): 
    [];
    return donationItems; 
};
export const setDonationItems = (donationItems) => {
    localStorage.setItem('donationItems', JSON.stringify(donationItems));
}