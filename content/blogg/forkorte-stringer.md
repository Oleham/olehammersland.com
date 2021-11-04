+++
title = "Forkorte strenger"
date = "2021-11-04T15:33:19+01:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["automatisering","effektivisering","koding","maskinoversttelse","memoq","oversettelse","python","translation",]

# Add toc just above title
include_toc = true

# Add Alpine JS CDN
include_alpinejs = false

# Send data obj into Alpine.data()
include_data = false
+++

## Innledning

Denne uken fikk jeg et oppdrag som kort fortalt går ut på å redusere lengden på 3000 setninger. Kunden oppgir at det er en tegnbegrensning på 25 bytes, og nå trenger de noen til å nådeløst kutte ned lengden på disse setningene.

Språkbyrået oversender oppdraget som en Excel-tabell med makroer som teller antall tegn. Makroen teller dog ikke med  at ikke-ASCII-tegn tar opp mer enn en byte. Dette gjelder da især for ø, æ, å, Ø, Æ og Å, som alle tar opp to bytes. Vet ikke helt hvorfor kundene er så gniene på bytesene. 

Uansett slo det meg som lite effektivt, spesielt når Excel-makroen ikke teller riktig, så jeg har forsøkt å utvikle en litt raskere workflow. Håpet er å kunne bruke denne også på fremtidige oppdrag. Les videre:

## Ny arbeidsflyt

### Trinn 1: Analysere teksten

Jeg begynte med et python-skript som deler opp hver setning i enkeltord og deretter teller opp hvor ofte hvert enkeltord forekommer i setningen. Dette (meta!)skriptet skriver så et nytt python-skript som kun inneholder en liste over hvert ord dobbelt og en merknad om hvor ofte ordet forekommer i Excel-listen.

Slik ser det nye python-skriptet ut:
```python
vanlige_ord = [
    ('Ut-','Ut-'), # Antall: 1
    ('innmonteringsverktøy','innmonteringsverktøy'), # Antall: 1
    ('Belgia/Nederland','Belgia/Nederland'), # Antall: 1
    ('Tyskland/Sveits/Østerrike','Tyskland/Sveits/Østerrike'), # Antall: 1
    ('Frankrike/Belgia/Sveits/Lux.','Frankrike/Belgia/Sveits/Lux.'), # Antall: 1
    ('Italia/Sveits','Italia/Sveits'), # Antall: 1
    ('mørkeblå/beige','mørkeblå/beige'), # Antall: 1
    #[...]
    ('kjøretøy','kjøretøy.'), # Antall: 54
    ('til','til'), # Antall: 55
    ('T-skjorte','T-skjorte'), # Antall: 61
    ('venstre','venstre'), # Antall: 64
    ('f','f'), # Antall: 73
    ('Program','Program'), # Antall: 103
]
```

Merk at jeg kun har skilt opp ord etter mellomrommene i teksten. Derfor dukker det også opp flere ord som ikke er skilt av mellomrom. 

### Trinn 2: Lage forkortelser

Jeg gikk så manuelt gjennom denne python-listen og forkortet det høyre ordet i hver tuple, slik som dette:

```python
vanlige_ord = [
    ('Ut-','Ut-'), # Antall: 1
    ('innmonteringsverktøy','innmont.verktøy'), # Antall: 1
    ('Belgia/Nederland','B/NL'), # Antall: 1
    ('Tyskland/Sveits/Østerrike','DE/CH/A'), # Antall: 1
    ('Frankrike/Belgia/Sveits/Lux.','F/B/CH/LX'), # Antall: 1
    ('Italia/Sveits','I/CH'), # Antall: 1
    ('mørkeblå/beige','blå/beige'), # Antall: 1
    #[...]
    ('kjøretøy','kj.tøy.'), # Antall: 54
    ('til','til'), # Antall: 55
    ('T-skjorte','T-skj.'), # Antall: 61
    ('venstre','v.'), # Antall: 64
    ('f','f'), # Antall: 73
    ('Program','Pr.gram'), # Antall: 103
]
```

I denne første gjennomgangen konsentrerte jeg meg om de ordene som forekommer oftest og om de vanligste og mest lavthengende forkortelsene. Jeg gikk ikke gjennom fra A til Å, men holdt på en stund til jeg følte jeg hadde tatt det som ville gi størst utslag. 

### Trinn 3: Korte hver setning ned til 25 bytes

Etter å ha definert en rekke forkortelser, skrev jeg et nytt skript som søkte gjennom hele Excel-listen og sjekket hver setning om den er på mer enn 25 bytes. Hvis en setning er på over 25 bytes, vil den erstatte ordene i setningen med tilsvarende forkortelser fra `vanlige_ord`-listen helt til setningen kommer under 25 bytes eller det ikke finnes flere relevante forkortelser.

Resultatet i Excel blir seende slik ut:

![Utklipp fra Excel](/images/blogg/forkortede-strenger.jpg)

Utgangsspråket er helt til venstre, den norske oversettelsen i midten og den nye, forkortede versjonen helt til høyre. Om man sammenligner kolonne D og F, ser man at disse setningene nå er innenfor tegnbegrensningen.

Det som er ålreit, er at denne arbeidsflyten kan itereres flere ganger. Etter første gjennomgang kunne jeg skape en ny  `vanlige_ord`-liste, men denne gangen definere enda særere og mer uforståelige forkortelser. Det er ok, fordi det vil til slutt kun berøre setningene som fortsatt ligger over 25 bytes. Det er da sannsynligvis setninger som uansett må tåle litt dårligere leseforståelse.

Faremomentet er at setningene blir komplett uleselige. I flere tilfeller vil det nok gi mer mening å kutte ut enkelte ord, fremfor å forkorte hvert eneste ord enda litt til. Derfor tror jeg denne fremgangsmåten og andre «søk og erstatt»-metoder kun vil være effektivt til en viss grad. Men de kan skape et nyttig utgangspunkt.

## Oppsummering

Jeg tror dette er en mye mer effektiv arbeidsflyt enn å gå gjennom med kun vanlig «søk og erstatt». Jeg har nå gått gjennom prosessen tre ganger, og resultatet er at ca. 60 % av setningene er under 25 bytes-grensen 👍 Resten tar jeg nok manuelt. 
