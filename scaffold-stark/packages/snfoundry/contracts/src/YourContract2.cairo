use starknet::ContractAddress;

#[starknet::interface]
trait IMyFirstContract<ContractState> {
    fn get_value(self: @ContractState) -> u64;
    fn set_value(
        ref self: ContractState,
        cAddress: ByteArray,
        eventName: ByteArray,
        eventTitle: ByteArray,
        chain: ByteArray
    );
    fn get_Owner(self: @ContractState, index: u64) -> ContractAddress;
    fn get_cAddress(self: @ContractState, index: u64) -> ByteArray;
    fn get_eventName(self: @ContractState, index: u64) -> ByteArray;
    fn get_eventTitle(self: @ContractState, index: u64) -> ByteArray;
    fn get_chain(self: @ContractState, index: u64) -> ByteArray;
}

#[starknet::contract]
mod YourContract2 {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        count: u64,
        PersonMap: LegacyMap<u64, ContractAddress>,
        ContractAddressMap: LegacyMap<u64, ByteArray>,
        EventNameMap: LegacyMap<u64, ByteArray>,
        EventTitleMap: LegacyMap<u64, ByteArray>,
        ChainMap: LegacyMap<u64, ByteArray>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.count.write(1);
    }

    #[abi(embed_v0)]
    impl MyFirstContract of super::IMyFirstContract<ContractState> {
        fn get_value(self: @ContractState) -> u64 {
            self.count.read()
        }

        fn get_Owner(self: @ContractState, index: u64) -> ContractAddress {
            self.PersonMap.read(index)
        }

        fn get_cAddress(self: @ContractState, index: u64) -> ByteArray {
            self.ContractAddressMap.read(index)
        }

        fn get_eventName(self: @ContractState, index: u64) -> ByteArray {
            self.EventNameMap.read(index)
        }


        fn set_value(
            ref self: ContractState,
            cAddress: ByteArray,
            eventName: ByteArray,
            eventTitle: ByteArray,
            chain: ByteArray
        ) {
            let updateValue = self.count.read();
            let caller: ContractAddress = get_caller_address();

            self.PersonMap.write(updateValue, caller);
            self.ContractAddressMap.write(updateValue, cAddress);
            self.EventNameMap.write(updateValue, eventName);
            self.count.write(updateValue + 1);
            self.EventTitleMap.write(updateValue, eventTitle);
            self.ChainMap.write(updateValue, chain);
        }


        fn get_eventTitle(self: @ContractState, index: u64) -> ByteArray {
            self.EventTitleMap.read(index)
        }

        fn get_chain(self: @ContractState, index: u64) -> ByteArray {
            self.ChainMap.read(index)
        }
    }
}
