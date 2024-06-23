use starknet::ContractAddress;

#[starknet::interface]
trait IMyFirstContract<ContractState> {
    fn get_value(self: @ContractState) -> u64;
    fn set_value(ref self: ContractState, new_value: u64);
}

#[starknet::contract]
mod MyFirstContract {
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        value: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.value.write(1)
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueUpdate: ValueUpdate
    }

    #[derive(Drop, starknet::Event)]
    struct ValueUpdate {
        prev: u64,
        curr: u64,
    }

    #[abi(embed_v0)]
    impl MyFirstContract of super::IMyFirstContract<ContractState> {
        fn get_value(self: @ContractState) -> u64 {
            self.value.read()
        }

        fn set_value(ref self: ContractState, new_value: u64) {
            let val = self.value.read();
            self.value.write(new_value);
            self.emit(ValueUpdate { prev: val, curr: new_value });
        }
    }
}
