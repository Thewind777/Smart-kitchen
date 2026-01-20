import concurrent.futures
import time
from execution.price_engine import PriceEngine
from execution.cart_optimizer import CartOptimizer

def stress_task(n):
    start = time.time()
    pe = PriceEngine()
    # Vary the search term slightly to avoid pure local caching if we had it, but mostly to test DB
    term = "Pasta" if n % 2 == 0 else "Milk"
    results = pe.search_products(term)
    duration = time.time() - start
    return duration, len(results)

def run_stress_test(concurrency=20, requests=50):
    print(f"🔥 STARTING STRESS TEST: {requests} requests with {concurrency} concurrency...")
    
    times = []
    errors = 0
    
    start_all = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [executor.submit(stress_task, i) for i in range(requests)]
        
        for future in concurrent.futures.as_completed(futures):
            try:
                duration, count = future.result()
                times.append(duration)
                print(f"   Request finished in {duration:.2f}s (Fetched {count} items)")
            except Exception as e:
                print(f"   ❌ Request Failed: {e}")
                errors += 1
                
    total_time = time.time() - start_all
    avg_lat = sum(times) / len(times) if times else 0
    
    print("\n📊 STRESS TEST RESULTS")
    print(f"   Total Requests: {requests}")
    print(f"   Errors:      {errors}")
    print(f"   Total Time:  {total_time:.2f}s")
    print(f"   Avg Latency: {avg_lat:.2f}s")
    print(f"   Throughput:  {requests/total_time:.2f} req/s")
    
    if errors == 0 and avg_lat < 1.0:
        print("\n✅ PASSED: System handled load comfortably.")
    else:
        print("\n⚠️ WARNING: System showed strain (High Latency or Errors).")

if __name__ == "__main__":
    run_stress_test()
