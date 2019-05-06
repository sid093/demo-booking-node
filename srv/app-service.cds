using {app.flight as flight, app.booking as booking, app.ext.booking as booking_ext} from '../db/booking-model-ext';

service AppService {

    entity PaymentInfo  as projection on booking_ext.PaymentInfo;
    entity Bookings    	as projection on booking.Bookings;
    
    @readonly entity FlightRoutes   as projection on flight.FlightRoutes;
    @readonly entity Airports      as projection on flight.Airports;
    @readonly entity Airline      as projection on flight.Airline;
}
