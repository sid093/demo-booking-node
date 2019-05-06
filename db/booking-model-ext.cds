namespace app.ext.booking;

using app.booking as Booking from 'booking-app-model/db/booking-model';
using app.flight as Flight from 'booking-app-model/db/flight-model';

entity PaymentInfo {
    key CardNumber : String(16) not null;
    CardType      : String(15) not null;
    CVV            : Integer not null;
    CardHolder     : String(30) not null;
    CardExpiry     : DateTime not null;
}

extend Booking.Bookings {
    PaymentInfo  : Association to PaymentInfo;
};