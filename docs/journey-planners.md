# Info About Linking to Various Journey Planning Sites

## TFL

Base url : <https://tfl.gov.uk/plan-a-journey/>?

Query fields:

* from=South+Croydon+Rail+Station
* to=East+Croydon+Rail+Station
* timeIs=arriving
* time=1200
* date=20211021 (cannot use today/tomorrow)

If you want to do this for e.g. next Saturday will need some javascript

## National Rail

Base url is : <https://ojp.nationalrail.co.uk/service/>

The following work:

* timesandfares/LBG/SNR/saturday/1230/(arr|dep)
* ldbboard/(dep|arr)/SYD - live departure (arrival) boards
* details/LBG/SNR/saturday/1230/(arr|dep) (same format timesandfares) for details of the first journey after time
* planjourney/search : no idea!
* ldbboard/gotojp?fromCrs=ELE&toCrs=LSY&arrOrDep=dep seems to work
