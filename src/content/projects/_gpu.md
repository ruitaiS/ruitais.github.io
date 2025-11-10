baseline temps ~ 25-30C for CPU cores and ~40C on the GPU


vv The charts below is a few minutes after boot (you can tell b/c the wifi card usually heats up a bit once i've been using it, but rn it's quite cool)
I also have the case panels off rn so it would be interesting to see if there's a change in temperature once the panels go back on
if you really want to be autistic i guess measuring ambient temperature is important too, cause it do be getting colder

[lowk sometimes i feel like the scientific method creates a lot of overhead bc in most use cases it doesn't actually matter whether it's reproducible or whether it's scientifically sound, b/c i'm not producing results for anyone else, i'm producing them to guide my own decision-making. personally i'd be willing to make the tradeoff between knowing exactly how many degrees C each tiny tweaks affects the outcome, vs. not having to run the same experiment like 50 times and controlling for every little thing before deciding on what i'm going to do.

but idk, maybe it's kind of like when chefs come home from work and they just cook up whatever so they can eat. they're not gonna sit around plating their own food, but when you're working that's part of your craft, right. so i wouldn't go as far as to say that it's performative labor, but it's definitely spending a lot of effort generating a lot of datapoints that are really needed more to validate your claims to an audience, in a cultural/social context, rather than to inform your own processes. it's sort of the difference between creating a culturally legible artifact (the plated food, the rigorously conducted study) vs. the production of value in/of itself (the bowl of ramen, the eyeball / gut feel optimizations)

in 'zen and motorcycle maintenance' the dude has a friend who freaks out because he fixed his bike for him by making a shim out of a piece of an old beer can instead of buying the officially licensed $100 BMW part which does basically the same thing. it's a functionally identical solution which lacks the cultural layer >> and in this case at least it's primarily the cultural layer which drives the difference in capital value ($100 vs. basically free) and not the functional. to be fair, just like the difference between eating at a restaurant vs. at home, you can't deny there's experiential value in cultural coding - which we approximate by increased prices eg. conversion to capital value - but idk, sometimes (eg. in the case of the motorcycle repair), it does seem slightly unnecessary and extraneous to what you're actually trying to do. and then on the other end of the spectrum you have companies like Theranos where the entire value of the company derives from the performance of legitimacy.]



`sensors`
```
spd5118-i2c-0-53
Adapter: SMBus I801 adapter at efa0
temp1:        +27.0°C  (low  =  +0.0°C, high = +55.0°C)
                       (crit low =  +0.0°C, crit = +85.0°C)

spd5118-i2c-0-51
Adapter: SMBus I801 adapter at efa0
temp1:        +27.2°C  (low  =  +0.0°C, high = +55.0°C)
                       (crit low =  +0.0°C, crit = +85.0°C)

acpitz-acpi-0
Adapter: ACPI interface
temp1:        +27.8°C  

iwlwifi_1-virtual-0
Adapter: Virtual device
temp1:        +26.0°C  

coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +29.0°C  (high = +80.0°C, crit = +100.0°C)
Core 0:        +26.0°C  (high = +80.0°C, crit = +100.0°C)
Core 4:        +27.0°C  (high = +80.0°C, crit = +100.0°C)
Core 8:        +24.0°C  (high = +80.0°C, crit = +100.0°C)
Core 12:       +26.0°C  (high = +80.0°C, crit = +100.0°C)
Core 16:       +23.0°C  (high = +80.0°C, crit = +100.0°C)
Core 20:       +24.0°C  (high = +80.0°C, crit = +100.0°C)
Core 28:       +26.0°C  (high = +80.0°C, crit = +100.0°C)
Core 29:       +26.0°C  (high = +80.0°C, crit = +100.0°C)
Core 30:       +26.0°C  (high = +80.0°C, crit = +100.0°C)
Core 31:       +26.0°C  (high = +80.0°C, crit = +100.0°C)
```

`nvidia-smi`
```
Sun Nov  9 13:55:07 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.105.08             Driver Version: 580.105.08     CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 5070 Ti     On  |   00000000:01:00.0  On |                  N/A |
|  0%   35C    P8             15W /  300W |     450MiB /  16303MiB |      1%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
```

-------
After computer's been on for a bit:

ruitai@desktop:~/Repositories/ruitais.github.io$          sensors
spd5118-i2c-0-53
Adapter: SMBus I801 adapter at efa0
temp1:        +30.8°C  (low  =  +0.0°C, high = +55.0°C)
                       (crit low =  +0.0°C, crit = +85.0°C)

spd5118-i2c-0-51
Adapter: SMBus I801 adapter at efa0
temp1:        +31.0°C  (low  =  +0.0°C, high = +55.0°C)
                       (crit low =  +0.0°C, crit = +85.0°C)

acpitz-acpi-0
Adapter: ACPI interface
temp1:        +27.8°C  

iwlwifi_1-virtual-0
Adapter: Virtual device
temp1:        +29.0°C  

coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +34.0°C  (high = +80.0°C, crit = +100.0°C)
Core 0:        +28.0°C  (high = +80.0°C, crit = +100.0°C)
Core 4:        +30.0°C  (high = +80.0°C, crit = +100.0°C)
Core 8:        +29.0°C  (high = +80.0°C, crit = +100.0°C)
Core 12:       +29.0°C  (high = +80.0°C, crit = +100.0°C)
Core 16:       +27.0°C  (high = +80.0°C, crit = +100.0°C)
Core 20:       +28.0°C  (high = +80.0°C, crit = +100.0°C)
Core 28:       +30.0°C  (high = +80.0°C, crit = +100.0°C)
Core 29:       +30.0°C  (high = +80.0°C, crit = +100.0°C)
Core 30:       +30.0°C  (high = +80.0°C, crit = +100.0°C)
Core 31:       +30.0°C  (high = +80.0°C, crit = +100.0°C)





runs a lot faster, order of minutes rather than days

but it doesn't really seem to be struggling, and i feel like max load should always be max load, no? eg. even though its much faster than on CPU, the GPU is still underperforming relative to its max output.

on my laptop you could really tell it was going; the fans spin up and it starts to get hot. the card, not so much. everything runs normal and you can still use the machine

>> maybe CPU or I/O bottleneck? throttling?