package repository

import (
	"sync"

	"sava-io-webapp/backend/internal/entity"
)

type customerRepository struct {
	store *Store
	mu    sync.Mutex
}

func NewCustomerRepository(store *Store) CustomerRepository {
	return &customerRepository{store: store}
}

func (r *customerRepository) List() []entity.Customer {
	result := make([]entity.Customer, len(r.store.Customers))
	copy(result, r.store.Customers)
	return result
}

func (r *customerRepository) GetByID(id int64) (entity.Customer, bool) {
	for _, customer := range r.store.Customers {
		if customer.ID == id {
			return customer, true
		}
	}

	return entity.Customer{}, false
}

func (r *customerRepository) Create(customer entity.Customer) entity.Customer {
	r.mu.Lock()
	defer r.mu.Unlock()

	customer.ID = r.nextID()
	r.store.Customers = append(r.store.Customers, customer)
	return customer
}

func (r *customerRepository) Update(id int64, customer entity.Customer) (entity.Customer, bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for index, current := range r.store.Customers {
		if current.ID == id {
			customer.ID = id
			r.store.Customers[index] = customer
			return customer, true
		}
	}

	return entity.Customer{}, false
}

func (r *customerRepository) Delete(id int64) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	for index, current := range r.store.Customers {
		if current.ID == id {
			r.store.Customers = append(r.store.Customers[:index], r.store.Customers[index+1:]...)
			return true
		}
	}

	return false
}

func (r *customerRepository) nextID() int64 {
	var nextID int64 = 1
	for _, customer := range r.store.Customers {
		if customer.ID >= nextID {
			nextID = customer.ID + 1
		}
	}

	return nextID
}