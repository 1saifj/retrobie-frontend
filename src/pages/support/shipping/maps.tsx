import React from 'react';
import {Layout} from '../../../components';
import CurrentLocationIcon from '../../../assets/images/icons/current-location.svg';

export default function ShippingMaps(){

  return(
    <Layout>
      <div style={{margin: '128px auto', maxWidth: 800}}>
        <div>
          <div>
            <h1>
              Retrobie and Your Location Data
            </h1>
          </div>
          <div>
            <h3>
              1. About Our Mapping Provider
            </h3>
            <p>
              Our location services rely on <a href="https://openstreetmaps.org">
              Open Street Maps (OSM)
            </a> which is basically like
              wikipedia, but for addresses and locations - anyone can edit and modify existing
              locations on the map, and everyone has access to the data.
            </p>
            <p>
              If your address is missing from OSM and you'd like to add it, feel free to
              get in touch and we can guide you on how to do it. Otherwise, you can visit
              the website and add the location yourself! It takes about 2-3 days for the
              map to be updated on our site, however.
            </p>
          </div>

        </div>
        <div id={'common-issues-with-the-map'}>
          <h3>
            2. Common issues encountered with the maps
          </h3>
          <p>
            This is a list of common issues people often encounter
            when interacting with our maps
          </p>
          <div>
            <div id={'trouble-finding-location'}>
              <h4>
                a. Can't find your location through the search
              </h4>
              <p>
                If you can't find your location through our search functionality,
                it's not available to us through our mapping provider.
              </p>
              <p>
                The search functionality works best with nearby
                {" "}<b>
                  named roads
                </b>{" "}
                and monuments.

                So, while you may be unable to find the name of your
                specific estate/block of apartments, etc, you may have better luck
                searching for the name of a nearby road/shopping mall/government building... etc.
              </p>
              <p>
                Alternatively, click on the{" "}
                '<img style={{width: 12}} src={CurrentLocationIcon}/>'{" "}
                button and leave the other fields blank.
              </p>
              <p>
                <strong>
                  Note:
                </strong>{" "}
                don't forget to drag the red marker to your current location
                if it's innacurate.
              </p>
            </div>
            <div>
              <h4 id={'find-my-location-is-inaccurate'}>
                b. 'Find My Location' is inaccurate
              </h4>
              <p>
               <strong>
                 The problem:
               </strong> Clicking on{" "}
                '<img style={{width: 12}} src={CurrentLocationIcon}/>'{" "}
                results in a marker that isn't at your current location.
              </p>
              <p>
                Your device's GPS probably isn't modern or was only designed to
                locate you accurately to a few hundred meters. This is especially common
                in old computers and laptops.
              </p>
              <p>
                <strong>
                  Solution #1:
                </strong> The GPS location will be at least 60% accurate - it shouldn't
                be too far off from your current location.
                You can easily drag the marker to your current location to correct the innacuracy.
              </p>
              <p>
                <strong>
                  Solution #2:
                </strong> If <strong>solution #1</strong> doesn't work,
                transfer the cart to your mobile device and click on{" "}
                '<img style={{width: 12}} src={CurrentLocationIcon}/>'{" "}
                to try again!
              </p>
              <p>
                Mobile devices typically have more accurate geolocation services
                courtesy of the more modern technology they are built with.
              </p>
            </div>
            <div>
              <h4 id={'this-is-my-last-resort'}>
                c. None of the two options apply
              </h4>
              <p>
                If neither <b>option a</b> nor <b>option b</b> work for you,
                or if you are unable to load the map altogether, simply fill in
                the fields under the "<b>Detailed Information</b>" section and
                ignore the map altogether.

                One of our representatives will get in touch with you to get a better
                understanding of where you are located.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}