# Contributing Guidelines

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/sih_33.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Use meaningful variable names

### TypeScript (Frontend)
- Use ESLint configuration
- Follow React best practices
- Use TypeScript strict mode
- Write meaningful component names

## Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Pull Request Process

1. **Before Submitting**:
   - Run tests locally
   - Check code style
   - Update documentation if needed
   - Ensure all CI checks pass

2. **PR Description**:
   - Describe what changes you made
   - Explain why the changes were necessary
   - Reference any related issues
   - Include screenshots for UI changes

3. **Review Process**:
   - At least one reviewer required
   - Address all review comments
   - Keep PRs focused and small
   - Update documentation as needed

## Commit Message Format

Use conventional commits:
```
type(scope): description

feat: add new allocation algorithm
fix: resolve CSV upload issue
docs: update API documentation
style: format code according to guidelines
refactor: restructure AI engine
test: add unit tests for matching
```

## Issue Reporting

When reporting issues, include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python/Node versions)
- Screenshots if applicable

## Feature Requests

For new features:
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Check if it aligns with project goals

## Code Review Guidelines

### For Reviewers
- Be constructive and helpful
- Focus on code quality and functionality
- Check for security issues
- Verify tests are adequate
- Ensure documentation is updated

### For Authors
- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Keep discussions focused

## Development Workflow

1. **Planning**:
   - Create issue for new features
   - Discuss approach in comments
   - Get approval before starting

2. **Development**:
   - Create feature branch
   - Make incremental commits
   - Write tests as you go
   - Update documentation

3. **Testing**:
   - Run all tests
   - Test manually
   - Check edge cases
   - Verify performance

4. **Submission**:
   - Create pull request
   - Fill out template
   - Request review
   - Address feedback

## Project Structure

```
sih_33/
├── backend/           # Python FastAPI backend
├── frontend/          # Next.js React frontend
├── docs/              # Documentation
├── data/              # Sample data files
├── scripts/           # Utility scripts
└── tests/             # Test files
```

## AI/ML Components

When working with AI components:
- Document model requirements
- Include performance benchmarks
- Consider memory usage
- Test with different data sizes
- Handle model loading errors gracefully

## Database Changes

For database modifications:
- Create migration scripts
- Update model definitions
- Test with sample data
- Document schema changes
- Consider backward compatibility

## Security Considerations

- Never commit secrets or API keys
- Validate all inputs
- Use parameterized queries
- Implement proper error handling
- Follow OWASP guidelines

## Performance Guidelines

- Profile code for bottlenecks
- Use appropriate data structures
- Implement caching where beneficial
- Monitor memory usage
- Test with realistic data sizes

## Documentation

- Update README for major changes
- Document new API endpoints
- Include code examples
- Keep deployment guides current
- Write clear commit messages
