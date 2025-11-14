package ssafy.a303.backend.data;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DummyDataService dummyDataService;

    @Override
    public void run(String... args) throws Exception {
        dummyDataService.insertDummyData();
    }
}
