# Cheater Meter
## Given a Ubisoft player tag, rate the possibility the player is a cheater based off factors other than raw playstyle statistics.
The reason for why raw player statistics such as HSR, KD, WR, WL, and other stats are inaccurate is because many of these can be fudged.
For instance, a cheater can purposefully:
- Set their aimlock onto a bone other than the head, lowering HSR
- Lose games which they do not lose many MMR points, lowering WR + WL
- Allow themselves to die late round when a round is 'already won,' thereby lowering KD

For these reasons, I developed this, a program which rates a profile based on other factors. 
It makes two calls asynchronously per profile, one to Ubisoft's endpoints, and one to my filter for extreme statistics.
(Because at the end of the day, if someone has a 5 kill to death ratio, they're an exemption to the above rules)
