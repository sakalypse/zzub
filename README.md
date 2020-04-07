# zzub
Quiz games with your friend in real-time

# Setup instructions
## 1 - Clone 
```
git clone https://github.com/sakalypse/zzub.git
```
## 2 - Setup environnement file 
Rename .env.sample into .env and complete it<br/>
Rename .ormconfig-sample.json into .ormconfig.json and complete it<br/>
Rename back/.env-sample into back/.env and complete it
## 3 - Start 
On each directory : front/ and back/
```
npm install
```
Then, at the root :
```
docker-compose up --build
```