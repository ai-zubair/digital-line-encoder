const DYNAMIC_CACHE = 'dynamicCache';

self.addEventListener('fetch',(event)=>{
    console.log("intercepted");
    event.respondWith(handleCacheThenNetwork(event.request))
})

async function handleCacheThenNetwork(request){
    const cacheResponse = await caches.match(request);
    if(cacheResponse)
        return cacheResponse;
    else{
        const networkResponse = await fetch(request);
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        dynamicCache.put(request.url,networkResponse.clone());
        return networkResponse;
    }
}