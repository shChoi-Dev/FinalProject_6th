package com.shoppingmallcoco.project.config; // (DevInitRunner를 이 패키지에 두신 게 맞다면)

import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.entity.Member.Role; // Role enum을 임포트합니다.
import com.shoppingmallcoco.project.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DevInitRunner implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. MemberRepository에 정의된 existsByMemId 사용
        if (!memberRepository.existsByMemId("admin")) {

            // 2. Member 엔티티의 Builder 패턴 사용
            // 3. 엔티티의 실제 필드명(memId, memPwd 등) 사용
            Member adminMember = Member.builder()
                    .memId("admin")
                    .memPwd(passwordEncoder.encode("admin1234")) // 비밀번호 암호화
                    .memNickname("관리자")
                    .memName("관리자") // memName 필드
                    .memMail("admin@coco.com") // memMail 필드
                    .role(Role.ADMIN) // 4. Role을 ADMIN으로 설정
                    .build();

            memberRepository.save(adminMember);

            System.out.println(">>> 개발용 관리자 계정(admin / admin1234) 생성 완료 <<<");
        }
    }
}